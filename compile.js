const pbjs = require('protobufjs-cli/pbjs');
const pbts = require('protobufjs-cli/pbts');

const protos = [
  // Battle.net
  './bgs-sdk/pb/bgs/low/pb/client/account_service.proto',
  './bgs-sdk/pb/bgs/low/pb/client/authentication_service.proto',
  './bgs-sdk/pb/bgs/low/pb/client/challenge_service.proto',
  './bgs-sdk/pb/bgs/low/pb/client/club_membership_listener.proto',
  './bgs-sdk/pb/bgs/low/pb/client/club_membership_service.proto',
  './bgs-sdk/pb/bgs/low/pb/client/connection_service.proto',
  './bgs-sdk/pb/bgs/low/pb/client/friends_service.proto',
  './bgs-sdk/pb/bgs/low/pb/client/notification_service.proto',
  './bgs-sdk/pb/bgs/low/pb/client/presence_listener.proto',
  './bgs-sdk/pb/bgs/low/pb/client/presence_service.proto',
  './bgs-sdk/pb/bgs/low/pb/client/resource_service.proto',
  './bgs-sdk/pb/bgs/low/pb/client/session_service.proto',
  './bgs-sdk/pb/bgs/low/pb/client/whisper_listener.proto',
  './bgs-sdk/pb/bgs/low/pb/client/whisper_service.proto',

  './bgs-sdk/pb/bgs/low/pb/client/api/client/v1/block_list_listener.proto',
  './bgs-sdk/pb/bgs/low/pb/client/api/client/v1/block_list_service.proto',
  './bgs-sdk/pb/bgs/low/pb/client/api/client/v1/leaderboard_service.proto',
  './bgs-sdk/pb/bgs/low/pb/client/api/client/v1/recent_players_listener.proto',
  './bgs-sdk/pb/bgs/low/pb/client/api/client/v1/recent_players_service.proto',

  './bgs-sdk/pb/bgs/low/pb/client/api/client/v2/authentication_listener.proto',
  './bgs-sdk/pb/bgs/low/pb/client/api/client/v2/authentication_service.proto',
  './bgs-sdk/pb/bgs/low/pb/client/api/client/v2/channel_membership_service.proto',
  './bgs-sdk/pb/bgs/low/pb/client/api/client/v2/channel_service.proto',
  './bgs-sdk/pb/bgs/low/pb/client/api/client/v2/friends_listener.proto',
  './bgs-sdk/pb/bgs/low/pb/client/api/client/v2/friends_service.proto',
  './bgs-sdk/pb/bgs/low/pb/client/api/client/v2/game_utilities_service.proto',
  './bgs-sdk/pb/bgs/low/pb/client/api/client/v2/notification_listener.proto',
  './bgs-sdk/pb/bgs/low/pb/client/api/client/v2/notification_service.proto',
  './bgs-sdk/pb/bgs/low/pb/client/api/client/v2/presence_listener.proto',
  './bgs-sdk/pb/bgs/low/pb/client/api/client/v2/presence_service.proto',
  './bgs-sdk/pb/bgs/low/pb/client/api/client/v2/publication_listener.proto',
  './bgs-sdk/pb/bgs/low/pb/client/api/client/v2/publication_service.proto',
  './bgs-sdk/pb/bgs/low/pb/client/api/client/v2/report_service.proto',
  './bgs-sdk/pb/bgs/low/pb/client/api/client/v2/session_listener.proto',
  './bgs-sdk/pb/bgs/low/pb/client/api/client/v2/session_service.proto',
  './bgs-sdk/pb/bgs/low/pb/client/api/client/v2/voice_service.proto',

  './bgs-sdk/pb/bgs/low/pb/client/api/server/v2/channel_listener.proto',
  './bgs-sdk/pb/bgs/low/pb/client/api/server/v2/game_utilities_listener.proto',

  // Diablo II: Resurrected
  './bgs-sdk/pb/external/v1/character.proto',
  './bgs-sdk/pb/external/v1/charlist.proto',
  './bgs-sdk/pb/external/v1/cs_report.proto',
  './bgs-sdk/pb/external/v1/d2r_connection.proto',
  './bgs-sdk/pb/external/v1/diablo_clone.proto',
  './bgs-sdk/pb/external/v1/friend_info.proto',
  './bgs-sdk/pb/external/v1/game_management.proto',
  './bgs-sdk/pb/external/v1/game_proxy.proto',
  './bgs-sdk/pb/external/v1/game_version.proto',
  './bgs-sdk/pb/external/v1/gem_ticket.proto',
  './bgs-sdk/pb/external/v1/generic_resource.proto',
  './bgs-sdk/pb/external/v1/igr.proto',
  './bgs-sdk/pb/external/v1/leaderboard.proto',
  './bgs-sdk/pb/external/v1/limited_time_event.proto',
  './bgs-sdk/pb/external/v1/lobby.proto',
  './bgs-sdk/pb/external/v1/network.proto',
  './bgs-sdk/pb/external/v1/setting.proto',
  './bgs-sdk/pb/external/v1/terror_zones.proto',
  //'./pb/bgs-sdk/external/v1/warden3.proto',
  './bgs-sdk/pb/external/v1/web_api.proto',
];

pbjs.main([
  '-t', 'static-module',
  '-w', 'commonjs',
  '-o', './bgs-sdk/bundle.js',
  '-p', './bgs-sdk/pb',
].concat(protos));

pbjs.main([
  '-t', 'json',
  '-w', 'commonjs',
  '-o', './bgs-sdk/bundle-json.json',
  '-p', './bgs-sdk/pb',
].concat(protos));

pbts.main(['-o', './bgs-sdk/bundle.d.ts', './bgs-sdk/bundle.js']);