interface Props {
  users: string[];
}

export default function ConnectedUsers({ users }: Props) {
  return (
    <>
      <p>Utilisateurs connectés</p>
      <ul>
        {users.map((user) => (
          <li key={user}>{user}</li>
        ))}
      </ul>
    </>
  );
}
