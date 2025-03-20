type User = {
  id: string;
  username: string;
};

type Game = {
  id: string;
  name: string;
  ownerId: string;
  players: User[];
  roles: string[];
};
