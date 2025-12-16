import {Input, TextField} from "@heroui/react";

export default function Search() {
  return (
    <TextField className="w-full mt-5">
      <Input placeholder="Search events..." className="p-2 px-6 h-12 drop-shadow-2xl bg-primary-100 inputBox animate-enter" style={{ "--delay": "0.1s" }}/>
    </TextField>
  )
}