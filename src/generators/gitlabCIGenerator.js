function generateGitlabCI(config) {
  const { rVersion } = config;

  return `image: docker:latest
  
services:
  - docker:dind

variables:
  DOCKER_DRIVER: overlay2

stages:
  - build
  - test
  - deploy

before_script:
  - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY

build:
  stage: build
  script:
    - docker build -t $CI_REGISTRY_IMAGE:${rVersion} .
    - docker push $CI_REGISTRY_IMAGE:${rVersion}

test:
  stage: test
  script:
    - docker pull $CI_REGISTRY_IMAGE:${rVersion}
    - docker run $CI_REGISTRY_IMAGE:${rVersion} Rscript -e "print('Hello!')"

deploy:
  stage: deploy
  script:
    - docker pull $CI_REGISTRY_IMAGE:${rVersion}
    - docker tag $CI_REGISTRY_IMAGE:${rVersion} $CI_REGISTRY_IMAGE:latest
    - docker push $CI_REGISTRY_IMAGE:latest
  only:
    - main
  `;
}

module.exports = { generateGitlabCI };
