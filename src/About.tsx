export function AboutPage () {
  /* eslint-disable jsx-a11y/anchor-is-valid */
  return (
    <div className="section">
      <div className="block">
        <h1 className="title">About</h1>
        <p>
        This website is intended for analyzing and visualizing data for headhunting in Arknights video game by Hypergryph/Yostar.
        </p>
      </div>
      <div className="block">
        <h1 className="title">TODOs</h1>
        <div className="content">
        <ul>
          <li>Improve styling of operator cards to better indicate past/current/future shop operators</li>
          <li>Improve chart color consistency</li>
          <li>Subclasses</li>
          <li>Move on-the-fly chart calculations to build phase</li>
        </ul>
        </div>
      </div>
      <div className="block">
        <h1 className="title">Fair Use Disclaimer</h1>
        <p>
          This site and the content made available through this site are for educational and informational purposes only.
        </p>
        <p>
          The site may contain copyrighted material owned by a third party, the use of which has not always been specifically authorized by the copyright owner.<br />
          Notwithstanding a copyright owner’s rights under the Copyright Act, Section 107 of the Copyright Act allows limited use of copyrighted material without requiring permission from the rights holders, for purposes such as education, criticism, comment, news reporting, teaching, scholarship, and research. <br />
          These so-called “fair uses” are permitted even if the use of the work would otherwise be infringing.
        </p>
        <p>
          If you wish to use copyrighted material published on this site for your own purposes that go beyond fair use, you must obtain permission from the copyright owner.
        </p>
        <p>
          If you believe that any content or postings on this site violates your intellectual property or other rights, please send me an email at 1f35c@tuta.io.
        </p>
      </div>
      <div className="block">
        <h1 className="title">Attributions</h1>
        <p>
          <h2 className="subtitle">Special thanks to:</h2>
          <ul>
            <li><a href="https://www.arknights.global/">Hypergryph/Yostar</a> for creating the game</li>
            <li><a href="https://aceship.github.io/AN-EN-Tags/index.html">Aceship</a> for in-game assets</li>
            <li><a href="https://github.com/Kengxxiao/ArknightsGameData">Kengxxiao</a> for in-game data</li>
            <li><a href="https://gamepress.gg/arknights/">GamePress.com</a> for historical banner information</li>
          </ul>
        </p>
      </div>
      <div className="block">
        <h2 className="subtitle">This website was created using:</h2>
        <ul>
          <li><a href="https://reactjs.org/">React</a>&nbsp;- Javascript frontend framework</li>
          <li><a href="https://bulma.io/">Bulma</a>&nbsp;- Responsive CSS framework</li>
          <li><a href="https://www.ag-grid.com/">AG Grid</a>&nbsp;- Javascript grids and charts</li>
        </ul>
      </div>
    </div>
  );
  /* eslint-enable jsx-a11y/anchor-is-valid */
}

