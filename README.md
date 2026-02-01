# Tolstoy AI Auto-Optimizer

A high-end e-commerce video A/B testing dashboard that enables brands to run, analyze, and autonomously optimize video content to maximize conversion rates.

## Key Features

### 🧪 Advanced A/B Testing
- Create experiments with up to 3 video variants.
- Real-time performance tracking (Views, Conversions, Revenue).
- Datetime-based scheduling for precise experiment control.
- Integrated video player for variant preview.

### 🤖 AI-Powered Insights
- Generative analysis using OpenAI GPT-4o.
- Dynamic "Winner Reasoning" explaining why specific variants outperformed others.
- Actionable recommendations for future content optimization.
- Estimated revenue impact and uplift metrics.

### ⚡ Self-Correction Loop (Autonomous Optimization)
- **Kill Switch**: Automatically disables underperforming variants based on configurable thresholds.
- **Auto-Win**: Promotes statistically significant winners early to minimize lost conversions.
- **AI Activity Log**: Full audit trail of all autonomous system decisions.
- **Guardrails**: Configurable minimum sample size and uplift requirements.

### 📊 Analytics & Reporting
- Time-series data visualization using Recharts.
- Two-tailed p-value statistical significance at 95% confidence.
- Revenue-per-view (RPV) and conversion rate tracking.

## Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS & shadcn/ui
- **State**: TanStack React Query
- **Routing**: Wouter
- **Charts**: Recharts
- **Animations**: Framer Motion

### Backend
- **Server**: Express 5 on Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **AI**: Replit OpenAI Integration (GPT-4o)
- **Storage**: Replit Object Storage for video assets

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Database Setup**:
   ```bash
   npm run db:push
   ```

3. **Run Application**:
   ```bash
   npm run dev
   ```

4. **Access the Dashboard**:
   Open your browser and navigate to `http://0.0.0.0:5000`.

## Architecture

- `client/`: React frontend source code.
- `server/`: Express backend and database storage logic.
- `shared/`: Shared TypeScript types and Drizzle schema.
- `attached_assets/`: Static project assets and documentation.
