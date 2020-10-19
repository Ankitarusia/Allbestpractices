function fetchData(){
    fetch("https://api.spacexdata.com/v3/launches?limit=100")
    .then(response=>{
       if(!response.ok){
           throw Error("Error");
       } 
       return response.json();
    })
    .then(data=>{
        var filterYear=[];
        var filtersuccessLaunch=[];
        var successland=[];
        for(var i=0;i<data.length;i++){
            filterYear.push(data[i].launch_year);
            filtersuccessLaunch.push(data[i].launch_success);               
            successland.push(data[i].rocket.first_stage.cores[0].land_success);  
        }  
        var filtersuccessLand = successland.filter(function (e) {return e != null;});
       
        var htmlContent= Array.from(new Set(filterYear)).map(
            user=>{
                return `<div class="nav-tabs">
                <button class="btn_year" data-filter="${user}">${user}</button>
                </div>`             
            }
        ).join("");
        $(".launchYear").html(htmlContent);
        
        var successLaunch = Array.from(new Set(filtersuccessLaunch)).map(
            successlaunch=>{
                return `<div class="nav-tabs">
                <button class="btn_launch" data-filter="${successlaunch}">${successlaunch}</button>
                </div>`       
            }
        ).join("");
        $(".successLaunchYear").html(successLaunch);
        
        var successLand = Array.from(new Set(filtersuccessLand)).map(
            successland=>{
                return `<div class="nav-tabs">
                <button class="btn_land" data-filter="${successland}">${successland}</button>
                </div>`       
            }
        ).join("");
        $(".successLand").html(successLand);
        $(document).ready(function(){
            
            $(".btn_launch").click(function(){
                $(".btn_launch").removeClass('active');
                $(this).addClass('active');
                fetchFilter();
                }
            )
            $(".btn_land").click(function(){
                $(".btn_land").removeClass('active');
                $(this).addClass('active');
                fetchFilter();
                }
            )
            $(".btn_year").click(function() {
                $(".btn_year").removeClass('active');
                $(this).addClass('active');            
                            
                fetchFilter();
            })
            
            
        })
        function  fetchFilter(){
            var year=$(".btn_year.active").attr("data-filter");
            var launch= $(".btn_launch.active").attr("data-filter");
            var land= $(".btn_land.active").attr("data-filter");
            if((year!=undefined && year!="")||(launch!=undefined && launch!="")||(land!=undefined && land!=""))
            {
                var value="";
                if(year!=undefined && year!=""){
                    value+="&launch_year="+year;
                }
                if(launch!=undefined && launch!=""){
                    value+="&launch_success="+launch;
                }
                if(land!=undefined && land!=""){
                    value+="&land_success="+land;
                }
                fetch("https://api.spacexdata.com/v3/launches?limit=100"+value)
                .then(response=> response.json())
                .then(data=>{
                        const launchProgram= data.map(
                            launchprogram=>{
                                return `<div class="program tabcontent" id="">
                                <div class="image-content">
                                <img src="${launchprogram.links.mission_patch_small  }" alt="${launchprogram.launch_year}"/></div>
                                <p id="missionName">${launchprogram.mission_name} #${launchprogram.flight_number}</p>
                                <ul><span>Mission Ids:</span>
                                <li>${launchprogram.mission_id}</li>
                                </ul>
                                <p><span>Launch Year: </span>${launchprogram.launch_year}</p>
                                <p><span>Successful Launch :</span> ${launchprogram.launch_success}</p>
                                <p><span>Successful Landing: </span>${launchprogram.rocket.first_stage.cores[0].land_success}</p>
                                </div>`;
                            }
                        ).join("");
                        console.log(launchProgram);
                    $(".col-md-9").html(launchProgram);

                })
                
                .catch((error)=>{
                    console.error('Error:',error);
                });
            }
        }   
    
    })
    .catch((error)=>{
        console.error('Error:',error);
    });
}
fetchData();