
export type EventItem = {
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

export type EventInput = {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  imageUrl: string;
}

export type RegistrationItem = {
  id: string;
  eventId: string;
  createdAt: string;
  event: EventItem;
}