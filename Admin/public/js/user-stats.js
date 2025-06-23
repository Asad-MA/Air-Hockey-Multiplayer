jQuery(document).ready(function () {
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



    let usersTable = $('#users-table').DataTable({
        paging: true,
        searching: false,
        ordering: false,
        info: false,
    });

    fetchUsers({}).then(data => {
        if (data) {
            const rows = data.users.map((user, index) => ([
                index + 1,
                user.name,
                user.displayName,
                user.email,
                user.coins,
                user.dailyStreak,
                user.isVerified ? 'Yes' : 'No',
                user.accountStatus,
                new Date(user.createdAt).toLocaleString(),
                // user.lastActive ? new Date(user.lastActive).toLocaleString() : 'Never'
            ]));
            usersTable.clear().rows.add(rows).draw();
        }
    }).catch(error => {
        console.error('Error fetching users:', error);
    })

})



async function fetchLeaderboard({
    period = 'all',       // 'daily', 'weekly', 'monthly', 'all'
    sortBy = 'totalCoins',// 'totalCoins', 'winRate', etc.
    page = 1,
    limit = 10
} = {}) {
    try {
        const query = new URLSearchParams({ period, sortBy, page, limit });
        const response = await fetch(`http://localhost:3001/api/leaderboard?${query.toString()}`);

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

async function fetchUsers({
    order = 'desc',       // 'daily', 'weekly', 'monthly', 'all'
    sortBy = 'createdAt',// 'totalCoins', 'winRate', etc.
    page = 1,
    limit = 100
} = {}) {
    try {
        const query = new URLSearchParams({ sortBy, order, page, limit });
        const response = await fetch(`http://localhost:3001/api/users?${query.toString()}`);

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


function getMatchHistory({ page = 1, limit = 5, sort = 'recent', result = 'all' }) {
        const query = new URLSearchParams({ page, limit, sort, result });
        $.ajax({
            url: `http://localhost:3001/api/matchhistory?${query.toString()}`,
            method: 'GET',
            success: function (data) {
                console.log("Match History:", data);
                // Process and display match history data
                $('#match-history-table').empty();
                data.matches.forEach((match , i) => {
                    let className = match.winner == match.player1.name ? 'winner1' : 'winner2'
                    $('#match-history-table').append(`
                        <div class="ui-table-row d-flex align-center gap-10 match-result-${className}">
                                <span class="ui-table-col text-sm">${i+1}</span>
                                <span class="ui-table-col d-flex gap-10 justify-between align-center w-full-available">
                                    <div class="match-palyer text-left d-flex gap-10">
                                        <span class="user-avatar-sm box-img box-rounded w-50 h-50 bg-gray">
                                            <img src="${match.player1.avatar}" alt="Player 1 Avatar" class="w-full h-full box-rounded">
                                        </span>
                                        <span class="user-detail-sm w-full-available">
                                            <h5 class="text-sm user-displayname my-0">${match.player1.name}</h5>
                                            <div class="">
                                                <span class="user-name text-sm text-gray">Goals: ${match.player1.score}</span>
                                            </div>

                                        </span>
                                    </div>
                                    <div>
                                    <h3 class="history-verses heading-xs">VS</h3>
                                    </div>
                                     <div class="match-palyer text-right d-flex gap-10 justify-end">
                                        
                                        <span class="user-detail-sm w-full-available">
                                            <h5 class="text-sm user-displayname my-0">${match.player2.name}</h5>
                                            <div class="">
                                                <span class="user-name text-sm text-gray">Goals: ${match.player2.score}</span>
                                            </div>

                                        </span>
                                        <span class="user-avatar-sm box-img box-rounded w-50 h-50 bg-gray">
                                            <img src="${match.player2.avatar}" alt="Player 2 Avatar" class="w-full h-full box-rounded">
                                        </span>
                                    </div>

                                </span>

                            </div>
                        `)
                    });
            },
            error: function (error) {
                console.error("Error fetching match history:", error);
            }
        });
    } 


    getMatchHistory({limit: 0})

fetchLeaderboard({})
fetchUsers({})