jQuery(document).ready(function($){

    const tableTabs = $('.table-tab');
    const tableWraps = $('.table-wrap');


    tableTabs.on('click' , function(){
        tableTabs.removeClass('active-tab');
        $(this).addClass('active-tab');

        tableWraps.removeClass('active');
        $(`.${$(this).attr('data-tab')}`).addClass('active');


    });
   

     let leaderboardTableWeekly = $('#leaderboards-weekly').DataTable({
        paging: true,
        searching: false,
        ordering: false,
        info: false,
    });

     let leaderboardTableMonthly = $('#leaderboards-monthly').DataTable({
        paging: true,
        searching: false,
        ordering: false,
        info: false,
    });

     let leaderboardTableAllTime = $('#leaderboards-allTime').DataTable({
        paging: true,
        searching: false,
        ordering: false,
        info: false,
    });

   

       async function fetchLeaderboard({
        period = 'all',       // 'daily', 'weekly', 'monthly', 'all'
        sortBy = 'totalCoins',// 'totalCoins', 'winRate', etc.
        page = 1,
        limit = 10
    } = {}) {
        try {
            const query = new URLSearchParams({ period, sortBy, page, limit });
            const response = await fetch(`/api/leaderboard?${query.toString()}`);

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            return data; // { total, page, limit, players: [...] }

        } catch (error) {
            console.error('Failed to fetch leaderboard:', error);
            return null;
        }
    }


    fetchLeaderboard({period: 'weekly'}).then(data => {
        if (data) {
            const rows = data.map((player, index) => ([
                index + 1,
                player.displayName,
                player.gamesPlayed,
                player.totalCoins,
                player.totalScore,
                // player.totalWins,
                // player.totalLosses,
                // new Date(player.lastActive).toLocaleString()
            ]));
            leaderboardTableWeekly.clear().rows.add(rows).draw();
        }
    }).catch(error => {
        console.error('Error fetching leaderboard:', error);
    });

    fetchLeaderboard({period: 'monthly'}).then(data => {
        if (data) {
            const rows = data.map((player, index) => ([
                index + 1,
                player.displayName,
                player.gamesPlayed,
                player.totalCoins,
                player.totalScore,
                // player.totalWins,
                // player.totalLosses,
                // new Date(player.lastActive).toLocaleString()
            ]));
            leaderboardTableMonthly.clear().rows.add(rows).draw();
        }
    }).catch(error => {
        console.error('Error fetching leaderboard:', error);
    });

    fetchLeaderboard({}).then(data => {
        if (data) {
            const rows = data.map((player, index) => ([
                index + 1,
                player.displayName,
                player.gamesPlayed,
                player.totalCoins,
                player.totalScore,
                // player.totalWins,
                // player.totalLosses,
                // new Date(player.lastActive).toLocaleString()
            ]));
            leaderboardTableAllTime.clear().rows.add(rows).draw();
        }
    }).catch(error => {
        console.error('Error fetching leaderboard:', error);
    });


        // fetchLeaderboard({});
})