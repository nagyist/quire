module.exports = function(eleventyConfig, globalData, data) {
  const qicon = eleventyConfig.getFilter('qicon')

  return `
    <template id="js-search-results-template">
      <li class="quire-search__inner__list-item">
        <a class="js-search-results-item" href=""><h2 class="title"><span class="js-search-results-item-title"></span></h2>
        </a>
        <p><span class="js-search-results-item-type"></span> | <span class="js-search-results-item-length"></span> words</p>
      </li>
    </template>

    <div
      aria-expanded="false"
      class="quire-search"
      data-search-index="./search-index.json"
      id="js-search"
    >
      <div class="quire-search__close-button">
        <button class="button is-medium" onclick="toggleSearch()">
          ${qicon("close", "Close search window")}
        </button>
      </div>

      <div aria-label="search results" class="quire-search__inner">
        <section class="hero">
          <div class="hero-body">
            <div class="container">
              <div class="input-bar">
                <input
                  class="input is-large"
                  id="js-search-input"
                  name="search"
                  oninput="search()"
                  placeholder="Search this publication"
                  type="search"
                  value=""
                />
                <span>${qicon("search", "Search")}</span>
              </div>
              <ul class="quire-search__inner__list" id="js-search-results-list">
                <!-- search results here -->
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  `
}
