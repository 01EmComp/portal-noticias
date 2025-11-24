import "./TermsAndServices.css";

const TermsAndServices = () => {
  return (
    <div className="ts-container">
      <h2>TERMOS DE USO</h2>
      <p className="date">Última atualização: [Data]</p>
      <p>
        Bem-vindo ao [Nome do Site] (“nós”, “nosso” ou “site”). Ao acessar ou
        utilizar este site, você concorda em cumprir e estar sujeito aos
        seguintes Termos de Uso. Caso não concorde com qualquer parte destes
        termos, pedimos que não utilize o site.
      </p>
      <p>
        <span>1. Aceitação dos Termos:</span>
        <br />O uso deste site implica na aceitação integral e irrestrita dos
        presentes Termos de Uso e da Política de Privacidade. Reservamo-nos o
        direito de alterar estes termos a qualquer momento, sendo recomendada a
        revisão periódica.
      </p>
      <p>
        <span>2. Finalidade do Site:</span>
        <br /> O [Nome do Site] tem como objetivo divulgar notícias, artigos,
        informações e conteúdos de interesse público. Todo o conteúdo é
        disponibilizado de forma gratuita, salvo áreas que eventualmente possam
        exigir cadastro ou assinatura.
      </p>
      <div>
        <p>
          <span>3. Uso do Conteúdo</span>
        </p>
        <ul>
          <li>
            É proibida a reprodução, distribuição, transmissão ou modificação de
            qualquer conteúdo do site sem autorização prévia por escrito.
          </li>
          <li>
            O usuário pode compartilhar conteúdos publicamente disponíveis,
            desde que cite a fonte e o link original.
          </li>
          <li>
            Qualquer uso comercial do conteúdo requer autorização expressa do
            [Nome do Site].
          </li>
        </ul>
      </div>
      <div>
        <p>
          <span>4. Cadastro e Responsabilidade do Usuário</span>
          <br /> Caso o site ofereça áreas de cadastro, comentários ou fóruns:
        </p>
        <ul>
          <li>
            O usuário se compromete a fornecer informações verídicas e
            atualizadas.
          </li>
          <li>
            O usuário é integralmente responsável pelo conteúdo que publica.
          </li>
          <li>
            Comentários ofensivos, discriminatórios, difamatórios, ilegais ou
            que infrinjam direitos de terceiros serão removidos, podendo o
            usuário ser banido sem aviso prévio.
          </li>
        </ul>
      </div>
      <p>
        5. Propriedade Intelectual Todo o material publicado — incluindo textos,
        imagens, vídeos, logotipos e layout — é protegido por direitos autorais
        e pertence ao [Nome do Site] ou a seus respectivos autores/parceiros.
      </p>
      <p>
        6. Links Externos O site pode conter links para sites de terceiros. O
        [Nome do Site] não se responsabiliza pelo conteúdo, políticas ou
        práticas desses sites externos.
      </p>
      <div>
        <p>
          7. Limitação de Responsabilidade O [Nome do Site] se esforça para
          manter as informações corretas e atualizadas, porém não garante
          exatidão, completude ou atualidade de todos os conteúdos. Não nos
          responsabilizamos por:
        </p>
        <ul>
          <li>Erros, omissões ou imprecisões em notícias e artigos;</li>
          <li>
            Danos diretos ou indiretos decorrentes do uso ou da incapacidade de
            uso do site;
          </li>
          <li>Conteúdo publicado por usuários ou colaboradores externos.</li>
        </ul>
      </div>
      <p>
        8. Privacidade e Proteção de Dados O tratamento de dados pessoais segue
        as normas da Lei nº 13.709/2018 (Lei Geral de Proteção de Dados – LGPD).
        Detalhes estão descritos na Política de Privacidade.
      </p>
      <p>
        9. Alterações nos Termos Podemos alterar estes Termos de Uso a qualquer
        momento, com efeito imediato após a publicação no site. A continuidade
        do uso após a atualização implica aceitação das novas condições.
      </p>
      <p>
        10. Legislação e Foro Estes Termos de Uso são regidos pelas leis da
        República Federativa do Brasil. Fica eleito o foro da comarca de
        [Cidade/UF], com renúncia a qualquer outro, por mais privilegiado que
        seja, para dirimir eventuais controvérsias.
      </p>
      <p>
        Contato: Para dúvidas, sugestões ou solicitações, entre em contato
        através do e-mail: [email@seudominio.com]. © [Ano atual] [Nome do Site]
        – Todos os direitos reservados.
      </p>
    </div>
  );
};

export default TermsAndServices;
