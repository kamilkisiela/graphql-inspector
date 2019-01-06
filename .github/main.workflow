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
