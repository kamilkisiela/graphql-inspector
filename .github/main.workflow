workflow "Build and Test" {
  on = "push"
  resolves = "Test"
}

action "Install" {
  uses = "actions/npm@master"
  runs = "yarn"
  args = "install"
}

action "Build" {
  needs = "Install"
  uses = "actions/npm@master"
  runs = "yarn"
  args = "build"
}

action "Test" {
  needs = "Build"
  uses = "actions/npm@master"
  runs = "yarn"
  args = "test"
}

workflow "Clean" {
  on = "pull_request"
  resolves = ["Clean after a PR"]
}

action "Clean after a PR" {
  uses = "./actions/cleanup/"
  secrets = ["GITHUB_TOKEN"]
}

workflow "Label" {
  on = "pull_request"
  resolves = ["Label issues"]
}

action "Label issues" {
  uses = "./actions/merged/"
  secrets = ["GITHUB_TOKEN"]
}
