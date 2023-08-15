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
            dy_jiuyou:['male','qun',5,['sk_tangping']],
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