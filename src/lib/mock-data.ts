export interface MockUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  isPro: boolean;
}

export const currentUser: MockUser = {
  id: "user_1",
  name: "Karim Hamdi",
  email: "karim@devvault.dev",
  image: null,
  isPro: false,
};
