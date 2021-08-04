<template>
    <div class="page3">
        <zoomPack ref="waterBall" :optionProp="option"></zoomPack>
    </div>
</template>

<script>
    import zoomPack from '@/components/d3/zoomPack'
    let sum = 0
    export default {
        props: {

        },
        data() {
            return {
                option:null,
                moniData:[{
                    borderLength:300,
                    colorRange:['#8470FF','#6A5ACD'],
                    data: {
                    "name": "A1",
                    "id":"A1001",
                    'isNode': false,
                    "children": [
                        {
                            "name": "B1",
                            "id":"B1001",
                            'isNode': false,
                            "children": [
                                {
                                    "name": "C1",
                                    "id":"C1001",
                                    'isNode': true,
                                    "value": 150
                                },
                                {
                                    "name": "C2",
                                    "id":"C2001",
                                    'isNode': true,
                                    "value": 400
                                },
                                {
                                    "name": "C3",
                                    "id":"C3001",
                                    'isNode': true,
                                    "value": 180
                                }
                            ]
                        },
                        {
                            "name": "B2",
                            "id":"B2001",
                            "value": 110
                        }
                    ]
                }
                },{
                    borderLength:800,
                    colorRange:['#87CEFA','#1E90FF'],
                    data: {
                    "name": "A1",
                    "id":"A1001",
                    'isNode': false,
                    "children": [
                        {
                            "name": "B1",
                            "id":"B1001",
                            'isNode': false,
                            "children": [
                                {
                                    "name": "C1",
                                    "id":"C1001",
                                    'isNode': true,
                                    "value": 50
                                },
                                {
                                    "name": "C2",
                                    "id":"C2001",
                                    'isNode': true,
                                    "value": 300
                                },
                                
                                {
                                    "name": "C3",
                                    "id":"C3001",
                                    'isNode': true,
                                    "value": 180
                                },
                                {
                                    "name": "C4",
                                    "id":"C4001",
                                    'isNode': true,
                                    "value": 250
                                },
                                {
                                    "name": "C5",
                                    "id":"C5001",
                                    'isNode': true,
                                    "value": 380
                                },
                            ]
                        },
                        {
                            "name": "B2",
                            "id":"B2001",
                            "value": 110
                        },
                        {
                            "name": "B3",
                            "id":"B3001",
                            "value": 210
                        }
                    ]
                }
                },{
                    borderLength:600,
                    colorRange:['#FFA500','#FF0000'],
                    data: {
                    "name": "A1",
                    "id":"A1001",
                    "bgColor":'#6A5ACD',
                    'isNode': false,
                    "children": [
                        {
                            "name": "B1",
                            "id":"B1001",
                            "bgColor":'#6A5ACD',
                            'isNode': false,
                            "children": [
                                {
                                    "name": "C1",
                                    "id":"C1001",
                                    "bgColor":'#6A5ACD',
                                    'isNode': true,
                                    "value": 50
                                },
                                {
                                    "name": "C2",
                                    "id":"C2001",
                                    "bgColor":'#6A5ACD',
                                    'isNode': true,
                                    "value": 300
                                }
                            ]
                        },
                        {
                            "name": "B2",
                            "id":"B2001",
                            "bgColor":'#6A5ACD',  //传入bgColor  自定义图形背景色
                            "value": 110
                        }
                    ]
                }
                }]
            };
        },
        computed: {

        },
        watch: {

        },
        components: {
            zoomPack
        },
        created() {
           

        },
        mounted() {
            // this.option = this.moniData[1]
            setInterval(() => {
                if(sum > 3){
                    sum = 0
                }
                this.option = this.moniData[sum]
                sum ++ 
            }, 10000);

        },
        beforeDestroy() {
         
        },
        methods: {
            
        },
    };
</script>

<style>
    .page3 {
        width: 100%;
        height: 100vh;
    }

    .waterBall {
        width: 60%;
        /* height: 60%; */

    }

    .ts {
        font-size: 100px;
        stroke: #ffffff;
        stroke-width: 2px;
        font-weight: bold;
    }

    .waterBall1 .el-picker-panel {
        color: red !important;
        border: 1px solid #E4E7ED;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
        background: green;
        border-radius: 4px;
        line-height: 30px;
        margin: 5px 0;
    }
</style>