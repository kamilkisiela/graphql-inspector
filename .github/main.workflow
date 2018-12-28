workflow "Build and Test" {
  on = "push"
  resolves = "Test"
}

action "Install" {
  uses = "borales/actions-yarn@master"
  args = "install"
}

action "Build" {
  needs = "Install"
  uses = "borales/actions-yarn@master"
  args = "build"
}

action "Test" {
  needs = "Build"
  uses = "borales/actions-yarn@master"
  args = "test"
}
