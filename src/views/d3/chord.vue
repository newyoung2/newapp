<template>
    <div id="svgBox">
   
    </div>
</template>

<script>
    let width=900
    let height = 900
    var color =  d3.scaleOrdinal(d3.schemeCategory10);
    let gChord
    let gOuter
    let gInner
    let chord
export default {
    props: {

    },
    data() {
        return {

        };
    },
    computed: {

    },
    watch: {

    },
    components: {

    },
    created() {

    },
    mounted() {
       this.init()
    },
    methods: {
        init(){
            console.log(d3.range(-90, 270, 45))
            let continent = ['亚洲','欧洲','非洲','美洲','大洋洲']
            let data = [
                [1000,3000,5000,2000,57500],
                [2000,2000,8000,44000,4500],
                [4000,2000,67000,4000,8500],
                [3000,15000,7000,5000,3500],
                [50400,3000,20000,20000,5500]
            ]

          chord=  d3.chord().padAngle(0.02).sortSubgroups(d3.descending).sortChords(d3.descending)(data)   //生成弦布局
          gChord = d3.select('#svgBox').append('svg')
                     .attr('width',width)
                     .attr('height',height)
                     .append('g').attr('transform',`translate(${width/2},${height/2})`)
          gOuter = gChord.append('g').attr('class','gOuter')
          gInner = gChord.append('g').attr('class','gInner')
          
          //生成外环
          let arcOuter = d3.arc().innerRadius(width/2*0.7).outerRadius(width/2*0.7*1.1)
          gOuter.selectAll('outerPath').data(chord.groups)
                .enter()
                .append('path')
                .attr('class','outerPath')
                .attr('d',arcOuter)
                .attr('fill',function(e,i) {
                    return color(i)
                })
                .on('mouseover',function(element,index) {
                    gInner.selectAll('.innerPath')
                    .filter(function(d) {
                        
                        return d.source.index == element.index
                    })
                    .attr('opacity',1)
                })
                .on('mouseout',function(element,index) {
                    gInner.selectAll('.innerPath')
                    .filter(function(d) {
                        
                        return d.source.index == element.index
                    })
                    .attr('opacity',0.2)
                })

                // 生成外弦文字
                gOuter.selectAll('.outerText').data(chord.groups)
                      
                      .enter().append('text').attr('class','outerText')
                      .each(function(d,i) {
                          d.angle = (d.startAngle + d.endAngle)/2
                          d.name = continent[i]
                      })
                      .attr('transform',function(d) {
                          let result = `rotate(${d.angle*180/Math.PI})`
                          result += `translate(0,${-1*width/2*0.7*1.1-10})`
                          if(d.angle > Math.PI*3/4 && d.angle < Math.PI*5/4){
                              result += "rotate(180)"
                          }

                        //   console.log(result)
                          return result
                      })
                      .text(function(d) {
                          return d.name
                      })
          
                // 生成内弦
                const ribbon = d3.ribbon().radius(width/2*0.7);
                gInner.selectAll('innerPath').data(chord)
                .enter()
                .append('path')
                .attr('class','innerPath')
                .attr('d',ribbon)
                .attr('fill',function(e,i) {
                    return color(i)
                })
                .attr('opacity',0.2)

        },
    },
};
</script>

<style scoped>

</style>
