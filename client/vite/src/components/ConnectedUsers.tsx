import { PlayerColors } from "./WithRealtime";

interface Props {
  users: string[];
  colors: PlayerColors;
}

export default function ConnectedUsers({ users, colors }: Props) {
  return (
    <>
      <p>Utilisateurs connectés</p>
      <ul>
        {users.map((user) => (
          <li key={user} style={{ color: colors.get(user) }}>
            {user}
          </li>
        ))}
      </ul>
    </>
  );
}
