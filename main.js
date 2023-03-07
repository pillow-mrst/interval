// ユニット名と攻撃間隔[s]の配列
const unit_interval = [
  // 星5
  { name: "キクミコマチ", attribute: "炎", reach :"170", country: "和", interval: "2.72", accuracy: "o" },
  { name: "アイオス", attribute: "水", reach :"185", country: "王国", interval: "2.74", accuracy: "?" },
  { name: "モクレン", attribute: "風", reach :"155", country: "和", interval: "2.80", accuracy: "x" },
  { name: "ラッテ", attribute: "光", reach :"190", country: "お菓子", interval: "2.76", accuracy: "o" },
  { name: "メモリニカ", attribute: "闇", reach :"155", country: "死者", interval: "2.78", accuracy: "o" },
  { name: "ラヴィエチル", attribute: "炎", reach :"135", country: "雪", interval: "2.59", accuracy: "" },
  { name: "みくまり", attribute: "水", reach :"130", country: "和", interval: "2.44", accuracy: "o" },
  { name: "マギナアリス", attribute: "炎", reach :"180", country: "空", interval: "2.55", accuracy: "" },
  { name: "パステーニャ", attribute: "水", reach :"175", country: "砂漠", interval: "2.41", accuracy: "o" },
  { name: "シアノ", attribute: "風", reach :"190", country: "植物", interval: "2.60", accuracy: "" },
  // 星4
  { name: "ファンタジア", attribute: "風", reach :"140", country: "エレキ", interval: "2.62", accuracy: "" },
  { name: "クート", attribute: "光", reach :"150", country: "死者", interval: "2.66", accuracy: "o" },
  { name: "ラハティア", attribute: "炎", reach :"165", country: "魔法", interval: "2.29", accuracy: "" },
  { name: "エレオノール", attribute: "水", reach :"160", country: "死者", interval: "2.40", accuracy: "?" },
  { name: "プレネア", attribute: "風", reach :"175", country: "植物", interval: "2.24", accuracy: "o" },
  { name: "メイリーシャ", attribute: "風", reach :"160", country: "植物", interval: "2.58", accuracy: "o" },
  { name: "ホワイトミル", attribute: "光", reach :"170", country: "お菓子", interval: "2.22", accuracy: "o" },
  { name: "ドリミーナ", attribute: "光", reach :"180", country: "動物", interval: "2.64", accuracy: "" },
  { name: "ファニー", attribute: "闇", reach :"165", country: "エレキ", interval: "2.10", accuracy: "" }
  // 星3
];

const ON_MAX = 5;
const BODY_WIDTH = 500

// 理論値の計算
const theoreticalValueCalc = function ($path) {
  // 三項演算子：trueなら1, falseなら0 に変換
  let chk_status = $path.find('.reinforcement').prop('checked') ? 1 : 0;
  return (parseFloat($path.find('.interval').text()) * (1 - parseFloat($path.find('.quick').val()) / 100 * (1 + (chk_status * 5 / 100))) * (1 - 0.04 * ($path.find('.guts').val() - 1))).toFixed(4);
}

// 画面サイズを縮小
/*
const screenScale = function () {
  // cssは画面サイズが取得できないため、こちらで制御
  const $window_width = $(window).width();
  if ($window_width < BODY_WIDTH) {
    $('body').css({transform: "scale($window_width / BODY_WIDTH)"});
  }
}
*/

/////////////// Jqueryのイベント ///////////////

// 数値入力欄のペースト禁止
$('input[type=number]').on('paste', function () {
  return false;
});

// テーブルの行を動的生成
$(window).on('load', function () {
  const add_length = unit_interval.length;
  let rows = '';

  for (let i = 0; i < add_length; i++) {
    rows += '<tr class="hide">';
    if (unit_interval[i].accuracy == 'x') {
      rows += '<td class="column1">' + '<span class="name under">' + unit_interval[i].name + '</span>' + '</td>';
      rows += '<td class="column2">' + '<span class="interval under">' + unit_interval[i].interval + '</span>' + '</td>';
    } else {
      rows += '<td class="column1">' + '<span class="name">' + unit_interval[i].name + '</span>' + '</td>';
      rows += '<td class="column2">' + '<span class="interval">' + unit_interval[i].interval + '</span>' + '</td>';
    }
    rows += '<td class="column3">' + '<input class="reinforcement" type="checkbox">' + '</td>';
    rows += '<td class="column4">' + '<input class="quick" type="number" value="35" min="15" max="35" step="0.05">' + '</td>';
    rows += '<td class="column5">' + '<input class="guts" type="number" value="7" min="6" max="11" step="1">' + '</td>';
    rows += '<td class="column6">' + '<span class="value">' + 0 + '</span>' + '</td>';
    rows += '</tr>';
  }
  $('#tbd').append(rows);

  for (let i = 0; i < add_length; i++) {
    let $row_path = $('#tbd > tr').eq(i);
    $row_path.find('.value').text(theoreticalValueCalc($row_path));
  }
  // 行を非表示
  $('#tbd > tr').addClass('hide');

  // 端末に画面サイズを合わせる
  //screenScale();
});

/*
$(window).on('resize', function () {
  // 端末に画面サイズを合わせる
  screenScale();
});
*/

// 画像をクリックしたら行の表示、非表示を切り替え
$('#list').on('click', 'img', function () {
  const $this_path = $(this);
  const $table_path = $('#tbd > tr');
  const unit = $(this).attr('alt');
  const index = unit_interval.findIndex(value => value.name == unit)

  if ($table_path.not('.hide').length < ON_MAX) {
    $this_path.toggleClass('off');
    $table_path.eq(index).toggleClass('hide');
  } else {
    $this_path.addClass('off');
    $table_path.eq(index).addClass('hide');
  }
});

// 変更があったら理論値を更新
$('#tbd').on('change', '.reinforcement, .quick, .guts', function () {
  const $row_path = $(this).closest('tr');
  $row_path.find('.value').text(theoreticalValueCalc($row_path));
});

// 出力ボタン押した時
$('#memo').on('click', '#output', function () {
  $this_path = $(this);
  const $display_path = $('#tbd > tr').not('.hide');
  const row_length = $display_path.length;
  text = '';
  for (let i = 0; i < row_length; i++) {
    let $row_path =$display_path.eq(i);
    text += $row_path.find('.name').text() + '/';
    if ($row_path.find('.reinforcement').prop('checked')) {
      text += '5%' + '/';
    }
    text += parseFloat($row_path.find('.quick').val()).toFixed(3) + '/';
    text += 'guts' + $row_path.find('.guts').val() + '\n';
  }
  $('#message').text(text);
  $('#copy').prop('disabled', false);
});

// コピーボタン押した時
$('#memo').on('click', '#copy', function () {
  $this_path = $(this);
  navigator.clipboard.writeText($('#message').text());
  alert('コピーしました！');
  $('#output').prop('disabled', false);
  $this_path.prop('disabled', true);
});
