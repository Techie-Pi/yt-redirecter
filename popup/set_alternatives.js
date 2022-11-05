async function main() {
    let value = await browser.storage.local.get("alternatives");
    if (value == null || Object.keys(value).length === 0 || (value.alternatives != null && value.alternatives.length === 0)) {
        await setDefault()
        return main()
    }

    console.log(value)
    let alternatives = value.alternatives;
    document.getElementById("current-alternatives").innerHTML = `
    <ul>
        ${(() => {
            let returnValue = ""
            alternatives.forEach(alternative => {
                if (alternative.url != null) {
                    returnValue += `<li class="list-element">Type: URL · Name: ${alternative.name} · URL: <a href="${alternative.url}" target="_blank">${alternative.url}</a> · <button class="remove remove-${alternative.name}">Remove</button></li>`
                } else {
                    returnValue += `<li class="list-element">Type: Host · Name: ${alternative.name} · Host: <code>${alternative.host}</code> · <button class="remove remove-${alternative.name}">Remove</button></li>`
                }
            })
            return returnValue
        })()}
    </ul>
    `

    Array.from(document.getElementsByClassName("remove")).forEach(button => {
        button.addEventListener("click", () => {
            remove(Array.from(button.classList).filter(v => v !== "remove" && v.startsWith("remove-"))[0].replace("remove-", ""))
                .then(() => {
                    main()
                })
            button.remove()
        })
    })
}

document.getElementById("add-alternative").addEventListener("click", () => {
    let url = document.getElementById("input-url");
    let host = document.getElementById("input-host");
    let name = document.getElementById("input-name");

    if (name.value !== "" && (url.value !== "" || host.value !== "")) {
        if (url.value !== "") {
            add({
                name: name.value,
                url: url.value,
            }).then(main)
        } else {
            add({
                name: name.value,
                host: host.value,
            }).then(main)
        }
    }
})

async function remove(name) {
    let value = await browser.storage.local.get("alternatives");
    let alternatives = value.alternatives

    console.log(alternatives, alternatives.filter(v => v !== name))
    await browser.storage.local.set({
        alternatives: alternatives.filter(v => v.name !== name)
    })
}

async function add(newValue) {
    let value = await browser.storage.local.get("alternatives");
    let alternatives = value.alternatives
    alternatives.push(newValue)

    await browser.storage.local.set({
        alternatives,
    })
}

async function setDefault() {
    return await browser.storage.local.set({
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

main()
