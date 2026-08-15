export const studyGraphScript = `
const initStudyGraph = () => {
  const localHost = /^(localhost|127(?:\\.[0-9]+){3})$/.test(window.location.hostname)
  if (localHost && document.body?.dataset?.basepath) document.body.dataset.basepath = ""

  for (const toc of document.querySelectorAll(".toc")) {
    const header = toc.querySelector(".toc-header")
    const content = toc.querySelector(".toc-content")
    header?.classList.remove("collapsed")
    content?.classList.remove("collapsed")
    if (header instanceof HTMLButtonElement) {
      header.setAttribute("aria-expanded", "true")
      header.setAttribute("aria-disabled", "true")
      header.tabIndex = -1
    }
  }

  for (const overflowEnd of document.querySelectorAll(".toc .overflow-end, .backlinks .overflow-end")) {
    overflowEnd.remove()
  }

  const waitForD3 = () => {
    if (window.d3) return Promise.resolve(window.d3)
    const source = "https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js"
    if (!document.querySelector('script[src="' + source + '"]')) {
      const script = document.createElement("script")
      script.src = source
      script.crossOrigin = "anonymous"
      document.head.appendChild(script)
    }
    return new Promise((resolve, reject) => {
      let attempts = 0
      const check = () => {
        if (window.d3) return resolve(window.d3)
        attempts += 1
        if (attempts > 120) return reject(new Error("D3 did not load"))
        window.setTimeout(check, 50)
      }
      check()
    })
  }

  const roots = Array.from(document.querySelectorAll("[data-study-graph]"))
  for (const root of roots) {
    if (!(root instanceof HTMLElement) || root.dataset.studyGraphReady === "true") continue
    const preview = root.querySelector("[data-study-graph-preview]")
    if (!(preview instanceof HTMLElement)) continue

    const overlay = root.querySelector("[data-study-graph-overlay]")
    const openButton = root.querySelector("[data-study-graph-open]")
    const closeButton = root.querySelector("[data-study-graph-close]")
    const fullCanvas = root.querySelector("[data-study-graph-full]")
    const filterButtons = Array.from(root.querySelectorAll("[data-study-graph-category]"))
    const countLabel = root.querySelector("[data-study-graph-count]")
    const currentSlug = root.dataset.studyGraphCurrent || ""

    let allData
    try {
      allData = JSON.parse(root.dataset.studyGraphData || '{"nodes":[],"links":[]}')
    } catch {
      allData = { nodes: [], links: [] }
    }

    let graphLibrary
    let previewCleanup = () => {}
    let fullCleanup = null
    let activeCategory = "ALL"
    let destroyed = false

    const dataForCategory = (category) => {
      if (category === "ALL") return allData
      const nodes = (Array.isArray(allData.nodes) ? allData.nodes : []).filter(
        (node) => node.category === category,
      )
      const ids = new Set(nodes.map((node) => node.id))
      const links = (Array.isArray(allData.links) ? allData.links : []).filter(
        (link) => ids.has(link.source) && ids.has(link.target),
      )
      return { nodes, links }
    }

    const nodeHref = (slug) => {
      const homeLink = root.querySelector("[data-study-graph-home]")
      const homeHref =
        root.dataset.studyGraphHomeHref ||
        (homeLink instanceof HTMLAnchorElement ? homeLink.href : "") ||
        document.querySelector(".page-title a")?.href ||
        new URL("./", window.location.href).href
      const home = new URL(homeHref, window.location.href)
      const homePath = home.pathname.endsWith("/") ? home.pathname : home.pathname + "/"
      const baseSegments = homePath.split("/").filter(Boolean)
      const targetSegments = String(slug)
        .trim()
        .split("#", 1)[0]
        .replace(/^\\/+/, "")
        .replace(/\\.html?$/, "")
        .split("/")
        .filter(Boolean)
      if (targetSegments[0]?.toLowerCase() === "cs-note") targetSegments.shift()
      if (
        baseSegments.length > 0 &&
        targetSegments.slice(0, baseSegments.length).join("/") === baseSegments.join("/")
      ) {
        targetSegments.splice(0, baseSegments.length)
      }
      return new URL(targetSegments.join("/"), new URL(homePath, home.origin)).href
    }

    const renderGraph = (target, compact, graphData, d3) => {
      target.replaceChildren()
      const width = Math.max(target.clientWidth, compact ? 220 : window.innerWidth)
      const height = Math.max(target.clientHeight, compact ? 180 : window.innerHeight - 112)
      const nodes = (Array.isArray(graphData.nodes) ? graphData.nodes : []).map((node) => ({ ...node }))
      const nodeIds = new Set(nodes.map((node) => node.id))
      const links = (Array.isArray(graphData.links) ? graphData.links : [])
        .map((link) => ({ source: link.source, target: link.target }))
        .filter((link) => nodeIds.has(link.source) && nodeIds.has(link.target))

      if (nodes.length === 0) {
        const empty = document.createElement("p")
        empty.className = "study-graph-status"
        empty.textContent = "연결된 노트가 아직 없습니다."
        target.appendChild(empty)
        return () => target.replaceChildren()
      }

      const tooltip = document.createElement("div")
      tooltip.className = "study-graph-tooltip"
      tooltip.hidden = true
      target.appendChild(tooltip)

      const svg = d3
        .select(target)
        .append("svg")
        .attr("class", "study-graph-svg")
        .attr("viewBox", "0 0 " + width + " " + height)
        .attr("role", "img")
        .attr("aria-label", "노트 관계 그래프")
      const viewport = svg.append("g")
      const edgeSelection = viewport
        .append("g")
        .attr("class", "study-graph-edges")
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("class", "study-graph-edge")
      const nodeSelection = viewport
        .append("g")
        .attr("class", "study-graph-nodes")
        .selectAll("g")
        .data(nodes)
        .join("g")
        .attr("class", (node) => "study-graph-node" + (node.id === currentSlug ? " is-current" : ""))
        .attr("tabindex", 0)
        .attr("aria-label", (node) => node.title || node.id)
        .style("cursor", "pointer")

      const degrees = new Map()
      for (const link of links) {
        degrees.set(link.source, (degrees.get(link.source) || 0) + 1)
        degrees.set(link.target, (degrees.get(link.target) || 0) + 1)
      }
      nodeSelection
        .append("circle")
        .attr("r", (node) => Math.min(compact ? 6 : 8, 3.2 + Math.sqrt(degrees.get(node.id) || 0)))
        .attr("fill", (node) => node.color || "#8c83ff")
        .attr("class", "study-graph-node-dot")

      const simulation = d3
        .forceSimulation(nodes)
        .force("link", d3.forceLink(links).id((node) => node.id).distance(compact ? 42 : 78).strength(0.58))
        .force("charge", d3.forceManyBody().strength(compact ? -28 : -54))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collide", d3.forceCollide().radius((node) => 9 + Math.sqrt(degrees.get(node.id) || 0)))
        .stop()

      const updatePositions = () => {
        edgeSelection
          .attr("x1", (link) => link.source.x)
          .attr("y1", (link) => link.source.y)
          .attr("x2", (link) => link.target.x)
          .attr("y2", (link) => link.target.y)
        nodeSelection.attr("transform", (node) => "translate(" + node.x + "," + node.y + ")")
      }
      simulation.on("tick", updatePositions)
      for (let index = 0; index < (compact ? 180 : 260); index += 1) simulation.tick()
      updatePositions()

      const zoom = d3.zoom().scaleExtent([0.16, 4]).on("zoom", (event) => viewport.attr("transform", event.transform))
      svg.call(zoom)
      const xs = nodes.map((node) => Number(node.x) || width / 2)
      const ys = nodes.map((node) => Number(node.y) || height / 2)
      const minX = Math.min(...xs)
      const maxX = Math.max(...xs)
      const minY = Math.min(...ys)
      const maxY = Math.max(...ys)
      const graphWidth = Math.max(1, maxX - minX)
      const graphHeight = Math.max(1, maxY - minY)
      const padding = compact ? 28 : 80
      const maxScale = compact ? 0.94 : 0.96
      const settledScale = Math.max(
        0.16,
        Math.min(
          maxScale,
          Math.max(1, width - padding * 2) / graphWidth,
          Math.max(1, height - padding * 2) / graphHeight,
        ),
      )
      const centerX = (minX + maxX) / 2
      const centerY = (minY + maxY) / 2
      const finalTransform = d3.zoomIdentity
        .translate(width / 2 - centerX * settledScale, height / 2 - centerY * settledScale)
        .scale(settledScale)
      const initialScale = compact ? settledScale : settledScale * 1.08
      const initialTransform = d3.zoomIdentity
        .translate(width / 2 - centerX * initialScale, height / 2 - centerY * initialScale)
        .scale(initialScale)
      svg.call(zoom.transform, initialTransform)
      if (compact) {
        svg.call(zoom.transform, finalTransform)
      } else {
        svg
          .transition()
          .duration(760)
          .ease(d3.easeCubicOut)
          .call(zoom.transform, finalTransform)
      }

      const drag = d3
        .drag()
        .on("start", (event, node) => {
          if (!event.active) simulation.alphaTarget(0.25).restart()
          node.fx = node.x
          node.fy = node.y
        })
        .on("drag", (event, node) => {
          node.fx = event.x
          node.fy = event.y
          updatePositions()
        })
        .on("end", (event, node) => {
          if (!event.active) simulation.alphaTarget(0)
          node.fx = null
          node.fy = null
        })
      nodeSelection.call(drag)

      const clearFocus = () => {
        nodeSelection.classed("is-dimmed", false)
        edgeSelection.classed("is-dimmed", false)
        tooltip.hidden = true
      }
      const focusNode = (node) => {
        const related = new Set([node.id])
        for (const link of links) {
          if (link.source.id === node.id) related.add(link.target.id)
          if (link.target.id === node.id) related.add(link.source.id)
        }
        nodeSelection.classed("is-dimmed", (item) => !related.has(item.id))
        edgeSelection.classed("is-dimmed", (link) => link.source.id !== node.id && link.target.id !== node.id)
        tooltip.textContent = node.title || node.id
        tooltip.hidden = false
      }
      const positionTooltip = (event) => {
        const bounds = target.getBoundingClientRect()
        tooltip.style.left = Math.min(bounds.width - 16, Math.max(16, event.clientX - bounds.left)) + "px"
        tooltip.style.top = Math.min(bounds.height - 12, Math.max(12, event.clientY - bounds.top)) + "px"
      }
      nodeSelection
        .on("mouseenter", (event, node) => {
          focusNode(node)
          positionTooltip(event)
        })
        .on("mousemove", positionTooltip)
        .on("mouseleave", clearFocus)
        .on("focus", (_event, node) => focusNode(node))
        .on("blur", clearFocus)
        .on("click", (event, node) => {
          event.stopPropagation()
          window.location.href = nodeHref(node.id)
        })
        .on("keydown", (event, node) => {
          if (event.key !== "Enter" && event.key !== " ") return
          event.preventDefault()
          window.location.href = nodeHref(node.id)
        })

      return () => {
        svg.interrupt()
        simulation.stop()
        target.replaceChildren()
      }
    }

    const renderPreview = () => {
      if (!graphLibrary) return
      previewCleanup()
      previewCleanup = renderGraph(preview, true, allData, graphLibrary)
    }
    const renderFull = () => {
      if (!(fullCanvas instanceof HTMLElement) || !graphLibrary) return
      if (fullCleanup) fullCleanup()
      const filteredData = dataForCategory(activeCategory)
      fullCleanup = renderGraph(fullCanvas, false, filteredData, graphLibrary)
      if (countLabel instanceof HTMLElement) countLabel.textContent = filteredData.nodes.length + " notes"
    }
    const closeGraph = () => {
      if (!(overlay instanceof HTMLElement)) return
      overlay.classList.remove("active")
      overlay.setAttribute("aria-hidden", "true")
      document.body.classList.remove("study-graph-open")
      if (fullCleanup) {
        fullCleanup()
        fullCleanup = null
      }
    }
    const openGraph = () => {
      if (!(overlay instanceof HTMLElement)) return
      overlay.hidden = false
      overlay.classList.add("active")
      overlay.setAttribute("aria-hidden", "false")
      document.body.classList.add("study-graph-open")
      renderFull()
    }
    const onFilterClick = (event) => {
      if (!(event.currentTarget instanceof HTMLButtonElement)) return
      activeCategory = event.currentTarget.dataset.studyGraphCategory || "ALL"
      for (const button of filterButtons) {
        if (!(button instanceof HTMLButtonElement)) continue
        const active = button.dataset.studyGraphCategory === activeCategory
        button.classList.toggle("is-active", active)
        button.setAttribute("aria-pressed", String(active))
      }
      renderFull()
    }
    const onOverlayClick = (event) => {
      if (event.target === overlay) closeGraph()
    }
    const onKeydown = (event) => {
      if (event.key === "Escape" && overlay instanceof HTMLElement && overlay.classList.contains("active")) closeGraph()
    }

    if (openButton instanceof HTMLButtonElement) openButton.addEventListener("click", openGraph)
    if (closeButton instanceof HTMLButtonElement) closeButton.addEventListener("click", closeGraph)
    if (overlay instanceof HTMLElement) overlay.addEventListener("click", onOverlayClick)
    for (const button of filterButtons) button.addEventListener("click", onFilterClick)
    document.addEventListener("keydown", onKeydown)
    root.dataset.studyGraphReady = "true"

    waitForD3()
      .then((d3) => {
        if (destroyed) return
        graphLibrary = d3
        renderPreview()
        if (overlay instanceof HTMLElement && overlay.classList.contains("active")) renderFull()
      })
      .catch(() => {
        preview.textContent = "그래프를 불러오지 못했습니다."
        preview.classList.add("is-error")
      })

    const cleanup = () => {
      destroyed = true
      closeGraph()
      previewCleanup()
      if (openButton instanceof HTMLButtonElement) openButton.removeEventListener("click", openGraph)
      if (closeButton instanceof HTMLButtonElement) closeButton.removeEventListener("click", closeGraph)
      if (overlay instanceof HTMLElement) overlay.removeEventListener("click", onOverlayClick)
      for (const button of filterButtons) button.removeEventListener("click", onFilterClick)
      document.removeEventListener("keydown", onKeydown)
      root.dataset.studyGraphReady = "false"
    }
    if (typeof window.addCleanup === "function") window.addCleanup(cleanup)
  }
}

document.addEventListener("nav", initStudyGraph)
document.addEventListener("render", initStudyGraph)
initStudyGraph()
`
