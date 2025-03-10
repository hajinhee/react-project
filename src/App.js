import { Button, Chip } from "@mui/material";

function App() {
  return (
    <>
      <div className="flex flex-1 items-center justify-center flex-col">
        <div className="">Hello, Tailwind CSS!</div>
        <Chip label={<span>Chip Failed</span>} className="!pt-1"></Chip>
      </div>
    </>
  );
}

export default App;
