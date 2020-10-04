const app = document.querySelector('#app');

const getFileData = async () => {
  const rawFile = await fetch('./../files/empresas.json');
  return rawFile.json();
};

const printElements = (element) => Object.keys(element).map((key) => {
  if (typeof element[key] === 'string') {
    const wrapperDataDiv = document.createElement('div');
    wrapperDataDiv.setAttribute('class', 'data-wrapper');
    if (key !== 'Nombre_Entorno') {
      if (/url/gi.exec(key)) {
        const pKey = document.createElement('p');
        pKey.setAttribute('class', 'data-key');
        pKey.textContent = `${key.replace(/[_]+/gi, ' ')}:`;
        const pWrap = document.createElement('p');

        const aValue = document.createElement('a');
        aValue.setAttribute('class', 'data-value');
        aValue.textContent = element[key];
        aValue.href = element[key];
        aValue.target = '_blank';
        aValue.setAttribute('rel', 'noopener noreferrer nofollow');
        aValue.setAttribute('class', 'link-class');
        wrapperDataDiv.appendChild(pKey);
        pWrap.appendChild(aValue);
        wrapperDataDiv.appendChild(pWrap);
      } else {
        const pKey = document.createElement('p');
        pKey.setAttribute('class', 'data-key');
        pKey.textContent = `${key.replace(/[_]+/gi, ' ')}:`;

        const pValue = document.createElement('p');
        pValue.setAttribute('class', 'data-value');
        pValue.textContent = element[key];
        wrapperDataDiv.appendChild(pKey);
        wrapperDataDiv.appendChild(pValue);
      }
    }
    return wrapperDataDiv;
  }
  return printElements(element[key]);
}).flat();


(async () => {
  const { Empresas } = await getFileData();
  Empresas.forEach((company) => {
    const companyDiv = document.createElement('div');
    companyDiv.setAttribute('class', 'company');

    const infoCompanyDiv = document.createElement('div');
    infoCompanyDiv.setAttribute('class', 'collapse');

    const h1 = document.createElement('h1');
    h1.setAttribute('class', 'company-header');
    h1.addEventListener('click', () => {
      if (/collapse/g.exec(infoCompanyDiv.className)) {
        infoCompanyDiv.setAttribute('class', '');
      } else {
        infoCompanyDiv.setAttribute('class', 'collapse');
      }
    });

    h1.textContent = company.Nombre;
    companyDiv.appendChild(h1);

    if (company.Entorno) {
      const envs = company.Entorno;

      envs.forEach((env) => {
        const environmentDiv = document.createElement('div');
        environmentDiv.setAttribute('class', 'company-info collapse');

        const envNameDiv = document.createElement('div');
        const envKey = document.createElement('p');

        envKey.setAttribute('class', 'data-key');
        const envValue = document.createElement('p');

        envValue.setAttribute('class', 'data-value');
        envKey.textContent = 'Nombre Entorno:';
        envValue.textContent = env.Nombre_Entorno;
        envNameDiv.appendChild(envKey);
        envNameDiv.appendChild(envValue);
        envNameDiv.setAttribute('class', 'data-wrapper env-name bordered');
        envNameDiv.addEventListener('click', () => {
          if (/collapse/g.exec(environmentDiv.className)) {
            environmentDiv.setAttribute('class', 'company-info');
          } else {
            environmentDiv.setAttribute('class', 'company-info collapse');
          }
        });
        infoCompanyDiv.appendChild(envNameDiv);
        environmentDiv.append(...printElements(env));
        infoCompanyDiv.appendChild(environmentDiv);
      });
    }
    companyDiv.appendChild(infoCompanyDiv);
    app.appendChild(companyDiv);
  });
})();
