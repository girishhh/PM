import { exec } from "child_process";

const execute = async () => {
  exec(
    `migrate create ${process.argv[2]} --migrations-dir src/db/migrations --generator ./migration-config.ts`,
    (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    }
  );
};

execute();
