const tags = document.querySelector('#TagifyBasic'); 
console.log(tags);
const suggestions = document.querySelector('#suggestions');

tags.addEventListener('keyup', async (event) => { // Changed to 'input' event for real-time suggestions
    event.preventDefault();
    let value = event.target.value.trim();
    let whitelistValue = $(".lundislct").val();
    let whitelist = whitelistValue ? whitelistValue : "Choisir Categorie"; // Default value if no category is selected
    let response = await fetch(`https://clients1.google.com/complete/search?q=${value}&nolabels=t&client=youtube&ds=yt&dataType=jsonb`);
    response = await response.text();
    response = parseJSONP(response);    
    showSuggestions(response.suggestions, whitelist); // Pass the whitelist to showSuggestions
});

function showSuggestions(list, whitelist) {
    let template = `<ul>`;

    list.forEach(item => {
        if (item.phrase.startsWith(whitelist)) { // Only show suggestions that start with the selected category
            template += `<li>${item.phrase}</li>`;
        }
    });
    template += `</ul>`;

    suggestions.innerHTML = template;
}

function parseJSONP(jsonpResponse) {
    const jsonStart = jsonpResponse.indexOf('(') + 1;
    const jsonEnd = jsonpResponse.lastIndexOf(')');
    const jsonString = jsonpResponse.substring(jsonStart, jsonEnd);

    const jsonData = JSON.parse(jsonString);

    const result = {
        query: jsonData[0],
        suggestions: jsonData[1].map(item => ({
            phrase: item[0],
            index: item[1],
            details: item[2]
        })),
        metadata: jsonData[2]
    };

    return result;
}
