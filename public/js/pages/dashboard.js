jQuery(document).ready(function ($) {
    // Initialize the dashboard page
    console.log("Dashboard page initialized");

    // Example: Fetch and display user data
    function fetchUserData() {
        $.ajax({
            url: '/api/user/data',
            method: 'GET',
            success: function (data) {
                $('#user-data').html(JSON.stringify(data));
            },
            error: function (error) {
                console.error("Error fetching user data:", error);
            }
        });
    }


    function getDashboardStats() {
        $.ajax({
            url: '/api/stats/dashboard/mini',
            method: 'GET',
            success: function (data) {
                $('[data-games-played]').text(data.totalGames);
                $('[data-win]').text(data.totalWins);
                $('[data-lose]').text(data.totalLosses);
                $('[data-win-per]').text(data.winPercentage + '%');
                $('[data-win-streak]').text(data.winningStreak);
                $('[data-last-game]').text(data.lastGameStatus);
            },
            error: function (error) {
                console.error("Error fetching dashboard stats:", error);
            }
        });
    }

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


    fetchLeaderboard({ period: 'weekly', sortBy: 'totalCoins', page: 1, limit: 10 })
        .then(data => {
            if (data) {
                console.log('Leaderboard data:', data);
                $('#top3-weekly').empty();
                if(!data.length) $('#top3-weekly').append(`<div class="no-result-found flex-grow text-center"><i class="fa-solid fa-trophy text-gray" aria-hidden="true"></i><h4 class="heading-md text-gray text-center">Be the first champion of the week!</h4></div>`)
                data.slice(0, 3).forEach((player , i) => {
                    let className = i==0?'top-ranked-weekly3':'top-runner-up';
                    $('#top3-weekly').append(`
                        <div class="top-player-box ${className}">
                            <div class="player-avatar">
                                <img src="${player.avatar}" class="avatar"
                                    alt="Player Avatar">
                            </div>
                            <div class="top-player-content">
                                <div class="player-meta">
                                ${i==0? '<span class="text-gray text-sm mb-5 d-in-block"><i class="fa-solid fa-star rank-star-pink" aria-hidden="true"></i> Top Ranked</span>': ''}
                                <h3 class="player-d-name heading-xs">${player.displayName}</h3>
                                <!-- <span class="player-u-name">@redflag</span> -->
                            </div>
                            <div class="ui-divider bg-dark-gray"></div>
                            <div class="player-b-stats d-flex gap-30 align-center">
                                <div class="stat-block flex-grow d-flex justify-between align-center" >
                                    <span class="stat-key text-sm text-gray">Games Played:</span>
                                    <span class="stat-value text-sm">${player.gamesPlayed}</span>
                                </div>
                                <div class="divider-vr"></div>
                                <div class="stat-block flex-grow d-flex justify-between align-center">
                                    <span class="stat-key text-sm text-gray">Coin Earned</span>
                                    <span class="stat-value text-sm">${player.totalCoins}</span>
                                </div>
                            </div>
                            </div>
                        </div>
                    `);
                });
                
                // Process and display the leaderboard data as needed
            }
        });



    // All Time Top Players
     fetchLeaderboard({ period: 'all', sortBy: 'totalCoins', page: 1, limit: 5 })
        .then(data => {
            if (data) {
                console.log('Leaderboard data:', data);
                $('#top-players-table').empty();
                if(!data.length) $('#top-players-table').append(`<div class="no-result-found flex-grow text-center"><i class="fa-solid fa-trophy text-gray" aria-hidden="true"></i><h4 class="heading-md text-gray text-center">Be the first champion of the week!</h4></div>`)
                data.slice(0, 3).forEach((player , i) => {
                    // let className = i==0?'top-ranked-weekly3':'top-runner-up';
                    $('#top-players-table').append(`
                        <div class="ui-table-row d-flex align-center gap-10">
                                <span class="ui-table-col text-sm">${i}</span>
                                <span class="ui-table-col d-flex gap-10 w-full-available">
                                    <span class="user-avatar-sm box-img box-rounded w-50 h-50 bg-gray">
                                        <img src="${player.avatar}" alt="Player Avatar" class="w-full h-full box-rounded">
                                    </span>
                                    <span class="user-detail-sm w-full-available">
                                        <h5 class="text-sm user-displayname my-0">${player.displayName}</h5>
                                        <div class="d-flex justify-between">
                                            <span class="user-name text-sm text-gray">@username</span>
                                            <span class="d-flex align-center text-sm gap-5 text-gray">${player.totalCoins} <img width="15" src="https://res.cloudinary.com/de6upiddr/image/upload/v1749232473/ynmuaabas41jbjkmjdpg.png" alt="" srcset=""></span>
                                        </div>

                                    </span>
                                </span>

                            </div>
                    `);
                });
                
                // Process and display the leaderboard data as needed
            }
        });


    //Get the match history
    function getMatchHistory({ page = 1, limit = 5, sort = 'recent', result = 'all' }) {
        const query = new URLSearchParams({ page, limit, sort, result });
        $.ajax({
            url: `/api/match-history?${query.toString()}`,
            method: 'GET',
            success: function (data) {
                console.log("Match History:", data);
                // Process and display match history data
                $('#match-history-table').empty();
                data.matches.forEach((match , i) => {
                    $('#match-history-table').append(`
                        <div class="ui-table-row d-flex align-center gap-10 match-result-${match.result}">
                                <span class="ui-table-col text-sm">${i+1}</span>
                                <span class="ui-table-col d-flex gap-10 justify-between align-center w-full-available">
                                    <div class="match-palyer text-left d-flex gap-10">
                                        <span class="user-avatar-sm box-img box-rounded w-50 h-50 bg-gray">
                                            <img src="${match.player.avatar}" alt="Player 1 Avatar" class="w-full h-full box-rounded">
                                        </span>
                                        <span class="user-detail-sm w-full-available">
                                            <h5 class="text-sm user-displayname my-0">${match.player.name}</h5>
                                            <div class="">
                                                <span class="user-name text-sm text-gray">Goals: ${match.player.score}</span>
                                            </div>

                                        </span>
                                    </div>
                                    <h3 class="history-verses heading-xs">VS</h3>
                                     <div class="match-palyer text-right d-flex gap-10 justify-end">
                                        
                                        <span class="user-detail-sm w-full-available">
                                            <h5 class="text-sm user-displayname my-0">${match.opponent.name}</h5>
                                            <div class="">
                                                <span class="user-name text-sm text-gray">Goals: ${match.opponent.score}</span>
                                            </div>

                                        </span>
                                        <span class="user-avatar-sm box-img box-rounded w-50 h-50 bg-gray">
                                            <img src="${match.opponent.avatar}" alt="Player 2 Avatar" class="w-full h-full box-rounded">
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

    // Call the function to get match history
    getMatchHistory({});

    // Call the function to get dashboard stats
    getDashboardStats();
    // Call the function to fetch user data
    fetchUserData();
});