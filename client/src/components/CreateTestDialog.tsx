import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Video, Loader2 } from "lucide-react";
import { useCreateTest } from "@/hooks/use-tests";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

// Simplified schema for the form
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  productName: z.string().min(1, "Product name is required"),
  targetPopulation: z.coerce.number().min(1, "Must be at least 1"),
  durationDays: z.coerce.number().min(1, "Must be at least 1 day"),
  variants: z.array(z.object({
    name: z.string().min(1, "Variant name required"),
    videoUrl: z.string().url("Must be a valid URL"),
    thumbnailUrl: z.string().url("Must be a valid URL"),
    description: z.string().optional(),
  })).min(2, "At least 2 variants are required"),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateTestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTestDialog({ open, onOpenChange }: CreateTestDialogProps) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const createTest = useCreateTest();
  
  const { register, control, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      productName: "",
      targetPopulation: 1000,
      durationDays: 7,
      variants: [
        { name: "Variant A", videoUrl: "", thumbnailUrl: "", description: "" },
        { name: "Variant B", videoUrl: "", thumbnailUrl: "", description: "" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await createTest.mutateAsync(data);
      toast({
        title: "Test Created",
        description: "Your A/B test has been successfully scheduled.",
      });
      onOpenChange(false);
      setLocation("/"); // Navigate back to dashboard
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create test",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display">Create New A/B Test</DialogTitle>
          <DialogDescription>
            Configure your video experiment details and upload variants.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Test Name</Label>
              <Input id="name" {...register("name")} placeholder="e.g. Summer Sale Video Copy" />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name</Label>
              <Input id="productName" {...register("productName")} placeholder="e.g. Premium Plan" />
              {errors.productName && <p className="text-sm text-red-500">{errors.productName.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="targetPopulation">Target Audience Size</Label>
              <Input type="number" id="targetPopulation" {...register("targetPopulation")} />
              {errors.targetPopulation && <p className="text-sm text-red-500">{errors.targetPopulation.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="durationDays">Duration (Days)</Label>
              <Input type="number" id="durationDays" {...register("durationDays")} />
              {errors.durationDays && <p className="text-sm text-red-500">{errors.durationDays.message}</p>}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Variants</Label>
              <Button type="button" variant="outline" size="sm" onClick={() => append({ name: `Variant ${String.fromCharCode(65 + fields.length)}`, videoUrl: "", thumbnailUrl: "", description: "" })}>
                <Plus className="w-4 h-4 mr-2" /> Add Variant
              </Button>
            </div>
            
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 relative group">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm text-slate-700">Variant {index + 1}</h4>
                  {fields.length > 2 && (
                    <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-red-500" onClick={() => remove(index)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-500">Name</Label>
                    <Input {...register(`variants.${index}.name`)} placeholder="Variant Name" className="bg-white" />
                    {errors.variants?.[index]?.name && <p className="text-xs text-red-500">{errors.variants[index]?.name?.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-500">Video URL</Label>
                    <div className="relative">
                      <Video className="w-3 h-3 absolute left-3 top-3 text-slate-400" />
                      <Input {...register(`variants.${index}.videoUrl`)} placeholder="https://..." className="pl-9 bg-white" />
                    </div>
                    {errors.variants?.[index]?.videoUrl && <p className="text-xs text-red-500">{errors.variants[index]?.videoUrl?.message}</p>}
                  </div>
                  <div className="col-span-2 space-y-1">
                    <Label className="text-xs text-slate-500">Thumbnail URL</Label>
                    <Input {...register(`variants.${index}.thumbnailUrl`)} placeholder="https://..." className="bg-white" />
                    {errors.variants?.[index]?.thumbnailUrl && <p className="text-xs text-red-500">{errors.variants[index]?.thumbnailUrl?.message}</p>}
                  </div>
                </div>
              </div>
            ))}
            {errors.variants && <p className="text-sm text-red-500">{errors.variants.message}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={createTest.isPending} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              {createTest.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create Test
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
