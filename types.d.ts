type User = {
  id: string;
  username: string;
};

type Game = {
  id: string;
  name: string;
  ownerId: string;
  owner: User;
};
