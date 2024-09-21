function generateDockerfile(config) {
  const {
    rVersion,
    baseImage,
    dependencies,
    systemPackages,
    customCommands,
    exposePorts,
    ports,
    workdir,
    copyFiles,
    entrypoint,
  } = config;

  let dockerfile = `FROM ${baseImage}:${rVersion}\n\n`;

  if (systemPackages) {
    dockerfile += `RUN apt-get update && apt-get install -y ${systemPackages}\n\n`;
  }

  if (dependencies.length > 0) {
    dockerfile += `RUN R -e "install.packages(c('${dependencies.join(
      "', '"
    )}'), repos='http://cran.rstudio.com/')"\n\n`;
  }

  if (customCommands) {
    dockerfile += `${customCommands}\n\n`;
  }

  if (workdir) {
    dockerfile += `WORKDIR ${workdir}\n\n`;
  }

  if (copyFiles) {
    dockerfile += `COPY . ${workdir}\n\n`;
  }

  if (exposePorts && ports) {
    dockerfile += `EXPOSE ${ports}\n\n`;
  }

  if (entrypoint) {
    dockerfile += `ENTRYPOINT ["${entrypoint}"]\n`;
  } else {
    dockerfile += `CMD ["R"]\n`;
  }

  return dockerfile;
}

module.exports = { generateDockerfile };
