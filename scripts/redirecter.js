console.log("YouTube ReDirecter: Enabled")

let alternatives = []
browser.storage.local.get("alternatives").then(v => {
    alternatives = v.alternatives;
    window.addEventListener("popstate", executeExtension);
    executeExtension();
})

function executeExtension() {
    let params = new URL(document.location).searchParams;

    if (params.get("redir") !== "cancel") {
        document.body.innerHTML = `
    <div style="margin: auto; width: 50vw; padding: 10px; background-color: rgb(204, 204, 204)">
        <h1 style="font-family: 'YouTube Sans', sans-serif; font-size: 40px">Are you sure?</h1>
        <p style="font-family: 'YouTube Sans', sans-serif; font-size: 27px; margin-bottom: 15px">Are you sure you want to go to YouTube? Check out these alternatives!</p>
        <div>
            ${(() => {
            let returnValue = "";
            alternatives.forEach(alternative => {
                if (alternative.url != null) {
                    returnValue += `<a style="font-family: 'YouTube Sans', sans-serif; font-size: 20px; margin: 3px" href="${alternative.url}">${alternative.name}</a> · `
                } else {
                    returnValue += `<a style="font-family: 'YouTube Sans', sans-serif; font-size: 20px; margin: 3px" href="${generateHref(alternative.host)}">${alternative.name}</a> · `
                }
            })
            return returnValue
        })()}
            <a style="font-family: 'YouTube Sans', sans-serif; font-size: 20px; margin: 3px" href="${generateYouTubeHref()}">...Go to YouTube anyway</a>
        </div>
    </div>
    `
    }
}

function generateHref(host) {
    return document.location.href.replace(/youtube\.com|www\.youtube\.com/g, host)
}

function generateYouTubeHref() {
    let url
    if (document.location.href.includes("?")) {
        url = document.location.href + "&redir=cancel"
    } else {
        url = document.location.href + "?redir=cancel"
    }

    return url
}
