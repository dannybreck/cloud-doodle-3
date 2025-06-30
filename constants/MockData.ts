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

// Sample cloud photos with doodle overlays
export const mockDoodles: Doodle[] = [
  {
    id: '1',
    title: 'Fluffy Sheep Cloud',
    description: 'A peaceful sheep floating in the sky',
    imageUrl: 'https://images.pexels.com/photos/281260/pexels-photo-281260.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: '2024-01-15T10:30:00Z',
    likes: 24,
    isLiked: true,
    tags: ['sheep', 'peaceful', 'fluffy'],
    drawingData: { hasDrawing: true },
  },
  {
    id: '2',
    title: 'Stormy Dragon Cloud',
    description: 'A mighty dragon emerging from storm clouds',
    imageUrl: 'https://images.pexels.com/photos/1431822/pexels-photo-1431822.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: '2024-01-14T16:45:00Z',
    likes: 18,
    isLiked: false,
    tags: ['dragon', 'storm', 'powerful'],
    drawingData: { hasDrawing: true },
  },
  {
    id: '3',
    title: 'Bird in Cloud',
    description: 'A graceful bird soaring through the clouds',
    imageUrl: 'https://images.pexels.com/photos/209831/pexels-photo-209831.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: '2024-01-13T09:15:00Z',
    likes: 31,
    isLiked: true,
    tags: ['bird', 'flying', 'graceful'],
    drawingData: { hasDrawing: true },
  },
  {
    id: '4',
    title: 'Whale Cloud',
    description: 'A gentle whale swimming through sky waters',
    imageUrl: 'https://images.pexels.com/photos/158163/clouds-cloudscape-fluffy-weather-158163.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: '2024-01-12T14:20:00Z',
    likes: 12,
    isLiked: false,
    tags: ['whale', 'ocean', 'gentle'],
    drawingData: { hasDrawing: true },
  },
  {
    id: '5',
    title: 'Heart Cloud',
    description: 'A romantic heart shape in the clouds',
    imageUrl: 'https://images.pexels.com/photos/531756/pexels-photo-531756.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: '2024-01-11T11:30:00Z',
    likes: 45,
    isLiked: true,
    tags: ['heart', 'love', 'romantic'],
    drawingData: { hasDrawing: true },
  },
  {
    id: '6',
    title: 'Bunny Clouds',
    description: 'Two fluffy bunnies hopping through the sky',
    imageUrl: 'https://images.pexels.com/photos/912364/pexels-photo-912364.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: '2024-01-10T17:00:00Z',
    likes: 28,
    isLiked: true,
    tags: ['bunny', 'cute', 'playful'],
    drawingData: { hasDrawing: true },
  },
];

// Featured doodles for home screen carousel
export const featuredDoodles = [
  {
    id: 'f1',
    title: 'Sheep',
    imageUrl: 'https://images.pexels.com/photos/281260/pexels-photo-281260.jpeg?auto=compress&cs=tinysrgb&w=300',
    doodleType: 'sheep'
  },
  {
    id: 'f2', 
    title: 'Dragon',
    imageUrl: 'https://images.pexels.com/photos/1431822/pexels-photo-1431822.jpeg?auto=compress&cs=tinysrgb&w=300',
    doodleType: 'dragon'
  },
  {
    id: 'f3',
    title: 'Bird', 
    imageUrl: 'https://images.pexels.com/photos/209831/pexels-photo-209831.jpeg?auto=compress&cs=tinysrgb&w=300',
    doodleType: 'bird'
  },
  {
    id: 'f4',
    title: 'Whale',
    imageUrl: 'https://images.pexels.com/photos/158163/clouds-cloudscape-fluffy-weather-158163.jpeg?auto=compress&cs=tinysrgb&w=300',
    doodleType: 'whale'
  },
];