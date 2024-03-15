'use strict';
game.import('character', function (lib, game, ui, get, ai, _status) {
    return{
        name: "diyu",
        connect:true,
        characterSort:{
            diyu:{
                renjian:['dy_jiuyou'],
            }
        },
        character:{
            dy_jiuyou:['male','qun',5,['sk_tangping','sk_fanzhi','sk_jiqu']],
        },
        characterIntro:{
            dy_jiuyou:"生活在地狱的人间，暗无天日，不见希望",
        },
        perfectPair:{},
        skill:{
            sk_tangping:{
                audio:2,
                trigger:{player:'phaseDrawBegin2'},
                direct:true,
                desc:"摸牌阶段摸牌时，你可以少摸任意张牌，然后获得等量的角色的各一张手牌。",
                filter:function(event){
                    return event.num>0;
                },
                content:function(){
                    "step 0"
                    player.chooseTarget(get.prompt('sk_tangping'),[1,trigger.num],function(card,player,target){
                        //&&target.countCards('h')>=player.countCards('h')  目标手牌数大于等于自己的手牌数
                        return target.countCards('h')>0&&player!=target;
                    },function(target){
                        var att=get.attitude(_status.event.player,target);
                        if(target.hasSkill('tuntian')) return att/10;
                        return 1-att;
                    });
                    "step 1"
                    if(result.bool){
                        player.logSkill('sk_tangping',result.targets);
                        player.gainMultiple(result.targets);
                        trigger.num-=result.targets.length;
                    }
                    else{
                        event.finish();
                    }
                    "step 2"
                    if(trigger.num<=0) game.delay();
                },
                ai:{
                    threaten:1.6,
                    expose:0.2
                }
            },
            sk_fanzhi:{
                //反制  判定区，红牌做杀，黑牌做闪 使用或打出。

            },
            sk_jiqu:{
                //汲取  锁定技，判定区数量变化你摸一张牌
                audio:2,
				trigger:{
					player:'loseAfter',
					global:['equipAfter','addJudgeAfter','gainAfter','loseAsyncAfter','addToExpansionAfter'],
				},
				frequent:true,
				filter(event,player){
                    console.log("判定区牌数量:" + player.countCards('j'));
					if(player.countCards('j')) return false;
					const evt=event.getl(player);
					return evt&&evt.player==player&&evt.hs&&evt.hs.length>0;
				},
				async content(event,trigger,player){
					player.draw();
				},
				ai:{
					threaten:0.8,
					effect:{
						target(card){
							if(card.name=='guohe'||card.name=='liuxinghuoyu') return 0.5;
						}
					},
					noh:true,
					skillTagFilter(player,tag){
						if(tag=='noh'){
							if(player.countCards('h')!=1) return false;
						}
					}
				}
                
            }
        },
        characterReplace:{},
        translate:{
            dy_jiuyou: "九幽",
            sk_tangping: "躺平",
            sk_tangping_info:'摸牌阶段摸牌时，你可以少摸任意张牌，然后获得等量的角色的各一张手牌。',

            renjian:"人间包",
        },
    }
});