/* --------------------------------------
   必要なパッケージを読み込みます
-------------------------------------- */

var gulp    = require('gulp');         /* gulp本体 */
var fs      = require('fs');           /* ファイルやディレクトリの操作 */
var plumber = require('gulp-plumber'); /* エラーでタスクが強制停止することを防止 */
var rename  = require('gulp-rename');  /* ファイルのリネーム */
var replace = require('gulp-replace'); /* テキスト置き換え */
var watch   = require('gulp-watch');   /* ファイルの更新を監視 */
var pug     = require('gulp-pug');     /* PugをHTMLに変換 */

/* --------------------------------------
   pug タスク（$ gulp pug で実行される）
-------------------------------------- */

gulp.task('pug', function() {
  
  var locals = {                /* conf.jsonの内容を読み込み変数localsに格納する */
    'site':JSON.parse(fs.readFileSync('./dev/pug/conf.json'))
  };
  
  gulp.src(['./dev/pug/**/*.pug','!./dev/pug/**/_*.pug']) /* Pugファイルの場所を指定 */
		.pipe(plumber())            /* エラーでタスクが強制停止することを防止 */
    .pipe(pug({                 /* PugをHTMLに変換 */
      locals: locals,           /* pugに変数localsを渡す */
  		pretty: true              /* 出力するHTMLをきれいに整形する */
    }))
    .pipe(gulp.dest('./html')); /* CMS用のディレクトリ./cmsに出力 */
});

/* --------------------------------------
   pug-cms タスク（$ gulp pug-cms で実行される）
-------------------------------------- */

gulp.task('pug-cms', function() {
  
  var locals = {
    'site':JSON.parse(fs.readFileSync('./dev/pug/conf-cms.json')) /* CMS用の設定ファイルよ読み込む */
  };
  
  gulp.src(['./dev/pug/**/*.pug','!./dev/pug/**/_*.pug'])
		.pipe(plumber())
    .pipe(pug({
      locals: locals,
  		pretty: true
    }))
		.pipe(replace('  ', ''))         /* 出力されるテキストからインデントを削除する */
    .pipe(rename({extname: '.txt'})) /* 出力されるファイルの拡張子を.txtに変更する */
    .pipe(gulp.dest('./cms'));       /* CMS用のディレクトリ./cmsに出力 */
});

/* --------------------------------------
   gulp のデフォルトの動作を指定
-------------------------------------- */

gulp.task('default', function() {
  watch('./dev/pug/**/*.pug', function () { /* 監視対処のPugファイルの場所を指定 */
    gulp.start(['pug']);                    /* HTML出力タスクを実行 */
    gulp.start(['pug-cms']);                /* CMS用のテキスト出力タスクを実行 */
  });
});

