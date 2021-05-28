window.onload = function()
{
    
    d3.select("#random").on('click',random);
    d3.select("#hand").on('click',hand);
    
 
}

class Graph 
{
        constructor(v)
        {
            this.v=v;
            this.time=0;
            this.adj=[];
            for (let i = 0; i < v; i++) 
            {
                this.adj.push([]);
                
            }
        }
        addEdge(v,w)
        {

            if(this.adj[v].length==0||!this.adj[v].includes(w))
            {        
                this.adj[v].push(w);
                this.adj[w].push(v);
            }
        }
        afficher()
        {
            //this.adj[0].push(0);
            //console.log(this.adj[0]);
            console.log(this.adj);
        }
        APUtil(u,visited,disc,low,parent,ap)
        {
            let children=0;
            visited[u]=true;
            disc[u]=low[u]= ++this.time;
            for (let i = 0; i < this.adj[u].length; i++) {
                let v= this.adj[u][i];
                if(!visited[v])
                {
                    children++;
                    parent[v]=u;
                    this.APUtil(v,visited,disc,low,parent,ap);
                    low[u]=Math.min(low[u],low[v]);
                    if(parent[u]==null && children>1)
                    {
                        ap[u]=true;
                    }                
                    if(parent[u]!=null && low[v]>= disc[u])
                    {
                        ap[u]=true;
                    }
        
                }
                else if (v !=parent[u])
                {
                    low[u]=Math.min(low[u],disc[v]);
                }
                
            }
        }
        AP()
        {
            let visited=[];
            let disc=[];
            let low=[];
            let parent=[];
            let ap=[];
            for (let i = 0; i < this.v; i++)
            {
                parent[i]=null;
                visited[i]=false;  
                ap[i]=false; 
            }
            for (let i = 0; i < this.v; i++)
            {
                if(visited[i]==false)
                {
                    this.APUtil(i,visited,disc,low,parent,ap);
                }
            }
            for (let i = 0; i < this.v; i++)
            {
                if(ap[i]==true)
                {
                console.log("point d'articulation : "+i+"\n");
                d3.select("#N"+i).style("fill","red");
                }
            }
            
        }
    
}


let cpt=0;
let fin=false;
let selected= false;
let id_clicked=0;
let nX=0;
let nY=0;
let arcs=[];
const node=()=>
{
    if(!fin)
    {    
        selected=false;
        let x = event.clientX;     // Get the horizontal coordinate
        let y = event.clientY;     // Get the vertical coordinate
        console.log("x et y "+x+" "+y );
        d3.select("#svg").append("circle").attr("cx", x).attr("cy", y).attr("r", 28).attr("fill", "#79C6A3");
        d3.select("#svg").append("circle").attr("cx", x).attr("cy", y).attr("r",25 ).attr("fill", "#050200").style("cursor","pointer").attr("id","N"+cpt);
        d3.select("#svg").append("text").attr("x", x-6).attr("y", y+8).style("font-size",18).style("font-weight",100).style("fill", "#FFFFFF").style("font-family",'Roboto').text(cpt); 
        d3.select("#N"+cpt).on('click',link);
        cpt++;
    }
}

const erase= ()=>
{
    d3.select("#random").remove();
    d3.select("#hand").remove();
    d3.select('#text').remove();
    d3.select("#svg").append("rect").attr("x", 550).attr("y", 700).attr("width", 260).attr("height", 48).attr("rx",18).attr("fill", "#8DCEA8").attr("id", "result");
    d3.select("#svg").append("text").attr("x", 630).attr("y", 734).style("font-size",28).style("font-weight",700).style("fill", "#FFFFFF").style("font-family",'Roboto').text("Résultat").attr("id","textRes"); 
}
const random=()=>
{
    erase();
    cpt= Math.floor(Math.random() * 9)+2;
    let nodes=[{x:371,y:288},{x:652,y:170},{x:989,y:238},{x:968,y:512},{x:682,y:516},{x:387,y:512},{x:566,y:329},{x:798,y:319},{x:1112,y:407},{x:192,y:386}];
    for (let i = 0; i< cpt; i++) 
        {
            let k= Math.floor(Math.random()*cpt/2);
            for(l=0;l<k;l++)
            {            
                j=Math.floor(Math.random()*cpt);
                if (j!=i )
                {
                    arcs.push({first:i,second:j});
                    let path = d3.path();
                    path.moveTo(nodes[i].x,nodes[i].y);
                    path.lineTo(nodes[j].x,nodes[j].y);
                    path.closePath();
                    d3.select("#svg").append("path").attr("d", path).attr("stroke", "white");
                    
                }
            }

        }    
        
    
    for (let i = 0; i < cpt; i++) {
        
        d3.select("#svg").append("circle").attr("cx", nodes[i].x).attr("cy", nodes[i].y).attr("r", 28).attr("fill", "#79C6A3");
        d3.select("#svg").append("circle").attr("cx", nodes[i].x).attr("cy", nodes[i].y).attr("r",25 ).attr("fill", "#050200").style("cursor","pointer").attr("id","N"+i);
        d3.select("#svg").append("text").attr("x", nodes[i].x-6).attr("y", nodes[i].y+8).style("font-size",18).style("font-weight",100).style("fill", "#FFFFFF").style("font-family",'Roboto').text(i); 
    }
    d3.select("#result").on('click',result);
}
const link=()=>
{
    if(!fin)
    {
        let x = event.clientX;     // Get the horizontal coordinate
        let y = event.clientY; 
        if(selected)
        {
            let id=(event.target.id);
            id=id.slice(1, id.length);
            console.log(id);
            arcs.push({first:id_clicked,second:id});
            let path = d3.path();
            path.moveTo(nX,nY);
            path.lineTo(x,y);
            path.closePath();
            d3.select("#svg").append("path").attr("d", path).attr("stroke", "white");
            selected=false;
        }
        else
        {
            id_clicked=(event.target.id);
            id_clicked=id_clicked.slice(1,id_clicked.length);
            console.log(id_clicked);
            selected=true;
            nX = event.clientX;     // Get the horizontal coordinate
            nY = event.clientY; 
            
        }

    }
}
async function result()
{
    fin=true;
    let graph= new Graph(cpt);
    for (let i = 0; i < arcs.length; i++) 
    {
       graph.addEdge(arcs[i].first,arcs[i].second);
    }
    graph.afficher();
    graph.AP();
    d3.select("#textRes").remove();
    d3.select("#result").remove();
    d3.select("#svg").append("rect").attr("x", 550).attr("y", 700).attr("width", 260).attr("height", 48).attr("rx",18).attr("fill", "#8DCEA8").attr("id", "result1");
    d3.select("#svg").append("text").attr("x", 630).attr("y", 734).style("font-size",28).style("font-weight",700).style("fill", "#FFFFFF").style("font-family",'Roboto').text("Refaire").attr("id","textRes1"); 
    d3.select("#result1").on("click",reload);

}
async function hand(){
    erase();
    await sleep(1);
    d3.select("#rect").on('click',node);
    d3.select("#result").on('click',result);
    
}
function reload()
{
    location.reload();
}
function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }