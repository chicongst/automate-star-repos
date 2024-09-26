(async function automateClickStars() {
  const listItems = document.querySelectorAll('li[role="listitem"]');
  
  const newTab = window.open('', '_blank');

  try {
    for (const item of listItems) {
      const link = item.querySelector('a[data-testid="listitem-title-link"]');
      if (link) {
        const url = link.href;
        console.log(`Click url: ${url}`)
        newTab.location.href = url;

        await new Promise((resolve) => {
          const checkTabLoaded = setInterval(() => {
            try {
              if (newTab.document.readyState === 'complete') {
                clearInterval(checkTabLoaded);
                
                const starButton = newTab.document.querySelector('form.unstarred.js-social-form button[data-hydro-click]');
                if (starButton) {
                  const hydroClickData = JSON.parse(starButton.getAttribute('data-hydro-click'));
                  if (hydroClickData.payload.target === "STAR_BUTTON") {
                    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
                    starButton.dispatchEvent(event);
                  }
                  setTimeout(() => {
                    resolve();
                  }, 3000);
                } else {
                  resolve();
                }
              }
            } catch (error) {
              clearInterval(checkTabLoaded);
              resolve();
            }
          }, 500);
        });

        newTab.location.href = 'about:blank';
      }
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    newTab.close();
    console.log('Done.');
  }
})();
