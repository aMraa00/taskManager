module.exports = {
    apps: [
      {
        name: "backend",
        cwd: "./backend",
        script: "npm",
        args: "run dev"
      },
      {
        name: "frontend",
        cwd: "./frontend",
        script: "npm",
        args: "run dev"
      }
    ]
  }
  