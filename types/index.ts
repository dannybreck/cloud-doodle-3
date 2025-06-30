export interface Doodle {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  drawingData?: any;
  createdAt: string;
  likes: number;
  isLiked: boolean;
  tags: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  doodlesCreated: number;
  likesReceived: number;
  memberSince: string;
}

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'text';
  disabled?: boolean;
  style?: any;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export interface CardProps {
  children: React.ReactNode;
  style?: any;
  onPress?: () => void;
}

export interface DoodleGridProps {
  doodles: Doodle[];
  onItemPress: (doodle: Doodle) => void;
  itemSize?: number;
  showDetails?: boolean;
}

export interface EmptyStateProps {
  title: string;
  subtitle?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}