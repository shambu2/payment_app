import { useState } from "react";
import { Button } from "./Button";

type UserType = {
  firstName: string;
  lastName: string;
  _id: number | string;
};

export const Users = () => {
  // Replace with backend call
  const [users, setUsers] = useState<UserType[]>([
    {
      firstName: "Harkirat",
      lastName: "Singh",
      _id: 1,
    },
  ]);

  return (
    <>
      <div className="font-bold mt-6 text-lg">Users</div>
      <div className="my-2">
        <input
          type="text"
          placeholder="Search users..."
          className="w-full px-2 py-1 border rounded border-slate-200"
        ></input>
      </div>
      <div>
        {users.map((user) => (
          <User key={user._id} user={user} />
        ))}
      </div>
    </>
  );
};
type UserProps = {
  user: UserType;
};

function User({ user }:UserProps) {
  return (
    <div className="flex justify-between">
      <div className="flex">
        <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
          <div className="flex flex-col justify-center h-full text-xl">
            {user.firstName[0]}
          </div>
        </div>
        <div className="flex flex-col justify-center h-ful">
          <div>
            {user.firstName} {user.lastName}
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center h-ful">
        <Button label={"Send Money"} onClick={()=>{console.log('hi button')}}/>
      </div>
    </div>
  );
}
