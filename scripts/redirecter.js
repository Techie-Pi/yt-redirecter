console.log("YouTube ReDirecter: Enabled")

const TIME_MARGIN = 5 * 60 * 1000

let alternatives = []
async function main() {
    browser.storage.local.get("alternatives").then(async (value) => {
        if (value == null || Object.keys(value).length === 0 || (value.alternatives != null && value.alternatives.length === 0)) {
            await setDefaultAlternatives()
            return main()
        }
        alternatives = value.alternatives;

        window.addEventListener("popstate", executeExtension);
        executeExtension()
            .then(() => {
                console.log("YouTube ReDirecter: Job finished")
            });
    })
}
main()

async function executeExtension() {
    let time = await browser.storage.local.get("lastTime");
    if (time == null || Object.keys(time).length === 0 || (time.lastTime != null && !Number.isInteger(time.lastTime))) {
        await setDefaultTime()
        return executeExtension()
    }

    if (Date.now() - time.lastTime > TIME_MARGIN) {
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
            <a style="font-family: 'YouTube Sans', sans-serif; font-size: 20px; margin: 3px" class="go-to-youtube" href="#">...Go to YouTube anyway</a>
        </div>
    </div>
    `
        document.getElementsByClassName("go-to-youtube").item(0).addEventListener("click", async () => {
            await setYouTubeTimeToNow()
            document.location.reload()
        })
    }
}

let prevHref = document.location.href
window.setInterval(() => {
    if (document.location.href !== prevHref) {
        prevHref = document.location.href
        executeExtension()
    }
}, 5000)

function generateHref(host) {
    return document.location.href.replace(/youtube\.com|www\.youtube\.com/g, host)
}

async function setYouTubeTimeToNow() {
    await browser.storage.local.set({
        lastTime: Date.now(),
    })
}

async function setDefaultTime() {
    await browser.storage.local.set({
        lastTime: Date.now() - TIME_MARGIN - 1,
    })
}

async function setDefaultAlternatives() {
    await browser.storage.local.set({
        alternatives: [
            {
                name: "CloudTube",
                host: "tube.cadence.moe",
            },
            {
                name: "Invidious",
                host: "yewtu.be"
            },
            {
                name: "Knowledge",
                url: "https://en.wikipedia.org/wiki/Special:Random"
            }
        ]
    })
}
