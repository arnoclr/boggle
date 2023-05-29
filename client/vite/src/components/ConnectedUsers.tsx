import { PlayerColors, PlayerName } from "./WithRealtime";

interface Props {
  users: PlayerName[];
  colors: PlayerColors;
}

export default function ConnectedUsers({ users, colors }: Props) {
  return (
    <div>
      <p>Utilisateurs connectés</p>
      <ul>
        {users.map((user) => (
          <li key={user} style={{ color: colors.get(user) }}>
            {user}
          </li>
        ))}
      </ul>
    </div>
  );
}
