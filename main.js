// ユニット名と攻撃間隔[s]の配列
const unit_interval = [
  // 星5
  { name: "キクミコマチ", interval: "2.72", accuracy: "" },
  { name: "アイオス", interval: "2.74", accuracy: "x" },
  { name: "モクレン", interval: "2.80", accuracy: "x" },
  { name: "ラッテ", interval: "2.76", accuracy: "o" },
  { name: "メモリニカ", interval: "2.78", accuracy: "o" },
  { name: "ラヴィエチル", interval: "2.59", accuracy: "" },
  { name: "みくまり", interval: "2.44", accuracy: "" },
  { name: "マギナアリス", interval: "2.55", accuracy: "" },
  { name: "テルジュア", interval: "2.85", accuracy: "" },
  { name: "パステーニャ", interval: "2.41", accuracy: "o" },
  { name: "シアノ", interval: "2.60", accuracy: "" },
  // 星4
  { name: "ファンタジア", interval: "2.62", accuracy: "" },
  { name: "クート", interval: "2.66", accuracy: "o" },
  { name: "ラハティア", interval: "2.29", accuracy: "" },
  { name: "エレオノール", interval: "2.40", accuracy: "" },
  { name: "プレネア", interval: "2.24", accuracy: "o" },
  { name: "メイリーシャ", interval: "2.58", accuracy: "o" },
  { name: "ホワイトミル", interval: "2.22", accuracy: "o" },
  { name: "ファニー", interval: "2.10", accuracy: "" }
  // 星3
];

const ON_MAX = 5;

// 理論値の計算
const theoreticalValueCalc = function ($path) {
  // 三項演算子：trueなら1, falseなら0 に変換
  let chk_status = $path.find('.reinforcement').prop('checked') ? 1 : 0;
  return (parseFloat($path.find('.interval').text()) * (1 - parseFloat($path.find('.quick').val()) / 100 * (1 + (chk_status * 5 / 100))) * (1 - 0.04 * ($path.find('.guts').val() - 1))).toFixed(4);
}

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
});

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