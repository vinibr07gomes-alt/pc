(() => {
  'use strict';

  const btnArrow = document.getElementById('btn-arrow');
  const content = document.getElementById('content-extra');
  const icon = btnArrow ? btnArrow.querySelector('i') : null;
  const emailBtn = document.querySelector('#email .contact-btn');
  const wppBtn = document.getElementById('wppVagaBtn');
  const wppTexto = document.getElementById('wppVagaTexto');
  const checkboxes = document.querySelectorAll('#vagasGrid input[type="checkbox"]');

  function btnEmailFunc() {
    setTimeout(() => {
      window.location.href = 'mailto:contato@3em1pizzaria.com.br';
    }, 200);
  }

  function abrir() {
    if (!content) return;
    if (icon) icon.classList.replace('fa-angle-down', 'fa-angle-up');
    content.style.display = 'block';
  }

  function fechar() {
    if (!content) return;
    if (icon) icon.classList.replace('fa-angle-up', 'fa-angle-down');
    content.style.display = 'none';
  }

  function verificar() {
    if (!content) return;
    const isOpen = content.style.display === 'block';
    if (isOpen) fechar();
    else abrir();
  }

  function atualizarWpp() {
    if (!wppBtn || !wppTexto) return;

    const selecionados = [...checkboxes]
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);

    if (selecionados.length === 0) {
      wppBtn.classList.add('wpp-btn-disabled');
      wppBtn.href = '#';
      wppTexto.textContent = 'Selecione uma vaga acima';
      return;
    }

    const lista = selecionados.length === 1
      ? selecionados[0]
      : `${selecionados.slice(0, -1).join(', ')} e ${selecionados.slice(-1)}`;

    const msg = encodeURIComponent(
      `Olá! Gostaria de trabalhar no estabelecimento. O(s) serviço(s) que posso oferecer: ${lista}.`
    );

    wppBtn.classList.remove('wpp-btn-disabled');
    wppBtn.href = `https://wa.me/5511997281316?text=${msg}`;
    wppTexto.textContent = '(11) 99728-1316 — Enviar candidatura';
  }

  if (btnArrow && content) btnArrow.addEventListener('click', verificar);
  if (emailBtn) emailBtn.addEventListener('click', btnEmailFunc);
  checkboxes.forEach((checkbox) => checkbox.addEventListener('change', atualizarWpp));
  atualizarWpp();
})();
