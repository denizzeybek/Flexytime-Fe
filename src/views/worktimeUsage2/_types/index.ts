export interface BadgeData {
  severity: string;
  title: string;
  icon: string;
  value: any;
}

export interface PerspectiveOption {
  name: string;
  value: number;
  icon: string;
}

export interface FilterPayload {
  perspective: number;
  interval: string | string[];
  teamId?: string | null;
  memberId?: string | null;
  isIndividual?: boolean;
}

export interface WorktimeUsageProps {
  viewMode: 'team' | 'individual';
}

export interface NavigationItem {
  label: string;
  routes: string[];
  icon: string;
  routeName: string;
}

export interface TeamMember {
  ID: string;
  Employee?: {
    Name: string;
    Abbreviation: string;
  };
  Team?: {
    Name: string;
    Abbreviation: string;
  };
  Supervisor?: {
    Name: string;
    Abbreviation: string;
  };
  Tags?: string[];
  Start: { time: string };
  End: { time: string };
  Work: { time: string };
  Leisure: { time: string };
  Meeting: { time: string };
  Unclassified: { time: string };
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor: string | string[];
  borderColor: string | string[];
}

export interface ChartInput {
  labels: string[];
  datasets: ChartDataset[];
  Unit?: string;
}