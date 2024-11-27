// backlog.js <- バックログの内部処理

class Backlog {
    constructor(gameState) {
        this.gameState = gameState;

        // バックログ画面を非表示
        this.isOpen = false;

        // 直前のシーンIDを追跡
        this.lastSceneId = null;
    }

    initialize() {
        // ゲーム開始時にバックログ画面を生成して非表示に設定
        console.log("バックログを初期化中...")
        this.renderBacklogOverlay();
        const overlay = document.getElementById('backlog-overlay');
        if (overlay) {
            overlay.style.display  = 'none';
            console.log("バックログオーバーレイを非表示に設定しました。");
        } else {
            console.error("バックログオーバーレイが生成されていません。");
        }
    }

    toggleBacklog() {
        const overlay = document.getElementById('backlog-overlay');

        if (!overlay) {
            console.error("バックログオーバーレイが見つかりません。");
            return;
        }

        if (this.isOpen) {

            // バックログ画面を閉じる
            overlay.style.display = 'none';
            this.isOpen = false;

            // ゲームを再開する
            gameState.isPaused = false;
            console.log("バックログを閉じてゲームを再開しました。")
        } else {

            // バックログ画面を開く
            overlay.style.display = 'flex';
            this.isOpen = true;
            gameState.isPaused = true;
            console.log("バックログを開いてゲームを一時停止しました。")
        }
    }

    // 履歴画面の生成
    renderBacklogOverlay() {
        let overlay = document.getElementById('backlog-overlay');
        if (!overlay) {
            // HTMLにオーバーレイ要素を生成
            const overlay = document.createElement('div');
            overlay.id = 'backlog-overlay';
            overlay.className = 'backlog-overlay';

            const content = document.createElement('div');
            content.className = 'backlog-content';

            // 履歴リストを生成
            const ul = document.createElement('ul');
            ul.id = 'backlog-list';
            content.appendChild(ul);

            // 「ゲームに戻る」ボタンを生成
            const returnButton = document.createElement('button');
            returnButton.className = 'backlog-return-button';
            returnButton.textContent = 'ゲームを再開する';
            returnButton.onclick = () => this.toggleBacklog();

            overlay.appendChild(content);
            overlay.appendChild(returnButton);
            document.body.appendChild(overlay);
        }

        this.updateBacklog();
    }

    updateBacklog() {
        const ul = document.getElementById('backlog-list');
        if (!ul) {
            console.error("バックログリストが見つかりません。");
            return;
        }
        // リストを初期化
        ul.innerHTML = '';

        this.gameState.history.forEach(entry => {
            console.log("履歴項目を追加:", entry); // デバッグ用
            const li = document.createElement('li');
            li.textContent =`${entry.scene}: ${entry.text}`;
            ul.appendChild(li);
        });
    }

    // バックログの追加
    addEntry(sceneId, text) {
        console.log("履歴に追加しようとしているデータ:", { sceneId, text });

        // 同じシーンが再表示された場合はスキップ
        if (this.lastSceneId === sceneId) {
            console.log(`シーンは再表示されたため、バックログに追加しません: ${sceneId}`);
            return;
        }

        this.gameState.history.push({ scene: sceneId, text });
        // シーンIDを記録
        this.lastSceneId = sceneId;
        console.log("バックログに追加されました。現在の履歴:", this.gameState.history);

        // 履歴を更新
        this.updateBacklog();
    }
}

window.Backlog = Backlog;