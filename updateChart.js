function updateChart(data, selection, transition) {

    var root = d3.hierarchy(data, d => d.branchset)
        .sum(d => d.branchset ? 0 : 1)
        .sort((a, b) => (a.value - b.value) || d3.ascending(a.data.length, b.data.length));
    
    cluster(root);
    setRadius(root, root.data.length = 0, innerRadius / maxLength(root));

    if (phylumColor.domain().includes(selection) && selection !== "") {
        i = 1;
        setColor(root);
    }
    else if (classColor.domain().includes(selection)) {
        i = 2;
        setColor(root)
    }
    else if (orderColor.domain().includes(selection)) {
        i = 3;
        setColor(root)
    }
    else if (familyColor.domain().includes(selection)) {
        i = 4;
        setColor(root)
    }
    else if (genusColor.domain().includes(selection)) {
        i = 5;
        setColor(root)
    }
    else if (speciesColor.domain().includes(selection)) {
        i = 6;
        setColor(root)
    }
    else {
        i = 0;
        setColor(root)
    }
    
    svg.append("style").text(`
    
    .link--active {
    stroke: #000 !important;
    stroke-width: 1.5px;
    }
    
    .link-extension--active {
    stroke-opacity: .6;
    }
    
    .label--active {
    font-weight: bold;
    }
    
    `);
    
    var linkExtension = svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "#000")
        .attr("stroke-opacity", 0.25)
        .selectAll("path")
        .data(root.links().filter(d => !d.target.children))
        .join("path")
        .each(function(d) { d.target.linkExtensionNode = this; })
        .attr("d", linkExtensionConstant);
    
    var link = svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "#000")
        .selectAll("path")
        .data(root.links())
        .join("path")
        .each(function(d) { d.target.linkNode = this; })

    if (transition === "y") {
        link
            .transition()
            .delay(function(d,i){if (i < 1000) {return i*10}
                else if (i > 1000 && i < 2000) {return i*4.5}
                else if (i > 1000 && i < 2000) {return i*4}
                else if (i > 2000 && i < 3000) {return i*3.5}
                else if (i > 3000 && i < 4000) {return i*3}
                else if (i > 4000 && i < 5000) {return i*2.5}
                else if (i > 5000 && i < 6000) {return i*2}
                else if (i > 6000 && i < 7000) {return i*1.5}
                else if (i > 7000 && i < 8000) {return i*1}
                else if (i > 8000 && i < 9000) {return i*0.5}
            }) 
            .attr("d", linkConstant)
            .attr("stroke", d => d.target.color);
    }
    else {
        link
            .transition()
            .delay(function(d,i){if (i < 1000) {return i*2.5}
                else if (i > 1000 && i < 2000) {return i*1.125}
                else if (i > 1000 && i < 2000) {return i*1}
                else if (i > 2000 && i < 3000) {return i*0.875}
                else if (i > 3000 && i < 4000) {return i*0.75}
                else if (i > 4000 && i < 5000) {return i*0.625}
                else if (i > 5000 && i < 6000) {return i*0.5}
                else if (i > 6000 && i < 7000) {return i*0.375}
                else if (i > 7000 && i < 8000) {return i*0.25}
                else if (i > 8000 && i < 9000) {return i*0.125}
            }) 
            .attr("d", linkConstant)
            .attr("stroke", d => d.target.color);}
    
    if (selection === "") {
        var openingText = svg.append("text")
            .attr("class", "openingText")
            .attr("dy", ".31em")
            .attr("text-anchor", "middle")
            .attr("opacity", 0)
            .text("AGORA2: 7206 reconstructions of diverse microbes")
            .style("font-size", "34px")
            .style("font-weight", "bold");

            /*radialOpeningText = svg.append("g")
            .attr("class", "radialOpeningText")
            .selectAll("text")
            .data(['Synergistetes', 'Spirochaetes', 'Fusobacteria', 'Bacteroidetes','Proteobacteria', 'Tenericutes' , 'Actinobacteria', 'Firmicutes'])
            .join("text")
            .attr("opacity", 0)
            .attr("transform", function(d,i){ if (i===0) {return `rotate(${ - 90 + 1}) translate(${innerRadius + 60},0)${i*20 < 180 ? "" : " rotate(180)"}`}
            else if (i===1) {return `rotate(${- 90 + 2.55}) translate(${innerRadius + 60},0)${i*20 < 180 ? "" : " rotate(180)"}`}
            else if (i===2) {return `rotate(${ - 90 + 4.1}) translate(${innerRadius + 60},0)${i*20 < 180 ? "" : " rotate(180)"}`}
            else if (i===3) {return `rotate(${ - 90 + 12}) translate(${innerRadius + 60},0)${i*20 < 180 ? "" : " rotate(180)"}`}
            else if (i===4) {return `rotate(${ - 90 + 95}) translate(${innerRadius + 60},0)${i*20 < 180 ? "" : " rotate(180)"}`}
            else if (i===5) {return `rotate(${ - 90 + 172}) translate(${innerRadius + 60},0)${i*20 < 180 ? "" : " rotate(180)"}`}
            else if (i===6) {return `rotate(${ - 90 + 183}) translate(${innerRadius + 60},0)${i*26 < 180 ? "" : " rotate(180)"}`}
            else if (i===7) {return `rotate(${ - 90 + 270}) translate(${innerRadius + 60},0)${i*26 < 180 ? "" : " rotate(180)"}`}
})
            .attr("dy", ".31em")
            .attr("text-anchor", (d,i) => i*26 < 180 ? "start" : "end")
            .style("font-size", "16px")
            //.attr("fill", function(d) {return phylumColor(d)})
            .text(d => d)

            radialOpeningText
            .transition()
            .duration(6000)
            .transition()
            .duration(3000)
            .attr("transform", function(d,i){ if (i===0) {return `rotate(${ - 90 + 1}) translate(${innerRadius + 4},0)${i*20 < 180 ? "" : " rotate(180)"}`}
            else if (i===1) {return `rotate(${- 90 + 2.55}) translate(${innerRadius + 4},0)${i*20 < 180 ? "" : " rotate(180)"}`}
            else if (i===2) {return `rotate(${ - 90 + 4.1}) translate(${innerRadius + 4},0)${i*20 < 180 ? "" : " rotate(180)"}`}
            else if (i===3) {return `rotate(${ - 90 + 12}) translate(${innerRadius + 4},0)${i*20 < 180 ? "" : " rotate(180)"}`}
            else if (i===4) {return `rotate(${ - 90 + 95}) translate(${innerRadius + 4},0)${i*20 < 180 ? "" : " rotate(180)"}`}
            else if (i===5) {return `rotate(${ - 90 + 172}) translate(${innerRadius + 4},0)${i*20 < 180 ? "" : " rotate(180)"}`}
            else if (i===6) {return `rotate(${ - 90 + 183}) translate(${innerRadius + 4},0)${i*26 < 180 ? "" : " rotate(180)"}`}
            else if (i===7) {return `rotate(${ - 90 + 270}) translate(${innerRadius + 4},0)${i*26 < 180 ? "" : " rotate(180)"}`}
})
            .attr("opacity", 1)*/
            
    if (transition === "y") {
        openingText
            .transition()
            .duration(3000)
            .attr("opacity", 1)
            .transition()
            .duration(9000)
            .attr("opacity", 0)
            .remove()
    }
    else {
        openingText.remove()
        }
    
    }

    if (svg.selectAll("path").size() < 1000) {
        var treeText = svg.append("g")
            .attr("class", "treeText")
            .selectAll("text")
            .data(root.leaves())
            .join("text")
            .attr("opacity", 0)
            .attr("dy", ".31em")
            .attr("transform", d => `rotate(${d.x - 90}) translate(${innerRadius + 4},0)${d.x < 180 ? "" : " rotate(180)"}`)
            .attr("text-anchor", d => d.x < 180 ? "start" : "end")
            .attr("xlink:href", function(d) {return "https://www.vmh.life/#microbe/" + d.data.name.replaceAll('.', '_')})
            .text(d => d.data.name.replace(/_/g, " "))
            .style("cursor", "pointer");
    
        treeText
            .transition()
            .duration(2000)
            .attr("opacity", 1)   
    
    treeText
        .on("mouseover", mouseovered(true))
        .on("mouseout", mouseovered(false))
        .on("click", function(){ window.open(d3.select(this).attr("xlink:href"));})
        }
    }