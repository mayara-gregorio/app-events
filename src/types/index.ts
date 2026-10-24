
export interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventInput {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  imageUrl: string;
}

export interface RegistrationItem {
  id: string;
  eventId: string;
  createdAt: string;
  event: EventItem;
}