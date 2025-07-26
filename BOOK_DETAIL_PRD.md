# PRD: 書籍詳細管理機能実装要件書

## 1. プロダクト概要

### 1.1 目的
技術専門書店在庫管理システム（TechBookStore）において、現在実装されていない書籍詳細表示・編集機能を実装し、書籍管理の運用効率を向上させる。

### 1.2 対象範囲
- 書籍一覧画面（`BookList.js`）の詳細ボタン機能化
- 書籍詳細モーダル・ページの実装
- 書籍情報の参照・編集機能
- 関連データ（著者、出版社、カテゴリ、在庫）の表示
- 既存API（`BookController.java`）の活用

### 1.3 現状の技術スタック
- **フロントエンド**: React 16.13.1, Material-UI 4.11.4, Redux 4.0.5
- **バックエンド**: Java 8, Spring Boot 2.3.12, Spring Data JPA
- **データベース**: H2（開発）, PostgreSQL（本番）

## 2. 機能要件

### 2.1 書籍詳細表示機能

#### 2.1.1 詳細ボタンの実装
```javascript
// BookList.js の詳細ボタンに onClick ハンドラーを追加
const handleDetailClick = (bookId) => {
  // 詳細モーダルを開く OR 詳細ページに遷移
};

// 既存の詳細ボタン
<Button 
  variant="outlined" 
  size="small"
  onClick={() => handleDetailClick(book.id)}
>
  詳細
</Button>
```

#### 2.1.2 表示する書籍情報
**基本情報**
- 書籍ID
- ISBN-13
- 書籍タイトル（日本語・英語）
- 出版社名
- 発行日
- 版次
- ページ数
- 技術レベル（BEGINNER/INTERMEDIATE/ADVANCED）
- バージョン情報
- サンプルコードURL

**価格情報**
- 定価（listPrice）
- 販売価格（sellingPrice）

**関連情報**
- 著者一覧（名前、カナ、役割: 著者/翻訳者/監修者）
- 技術カテゴリ（階層表示、プライマリカテゴリ強調）
- 在庫情報（店頭在庫、倉庫在庫、総在庫、予約数）

### 2.2 書籍詳細編集機能

#### 2.2.1 編集可能フィールド
**書籍基本情報**
- タイトル（日本語・英語）
- 出版社（ドロップダウン選択）
- 発行日（DatePicker）
- 版次（数値入力）
- ページ数（数値入力）
- 技術レベル（セレクトボックス）
- バージョン情報（テキスト入力）
- サンプルコードURL（URL入力）

**価格情報**
- 定価（数値入力、小数点2桁）
- 販売価格（数値入力、小数点2桁）

#### 2.2.2 バリデーション
- ISBN-13は読み取り専用（変更不可）
- タイトルは必須入力
- 価格は正の数値のみ
- URLは有効なURL形式
- 発行日は過去の日付のみ

### 2.3 UI/UX設計

#### 2.3.1 表示パターン
**Option A: モーダルダイアログ**
- `CustomerDetail.js`と同様のモーダル実装
- タブ構成: 基本情報/関連情報/在庫情報
- Material-UI Dialogコンポーネント使用

**Option B: 専用ページ**
- `/books/:id`ルートでページ遷移
- ブレッドクラム付きナビゲーション
- より詳細な情報表示エリア

#### 2.3.2 レスポンシブデザイン
- モバイル対応（タブレット・スマートフォン）
- Material-UIのGrid システム活用
- 画面サイズに応じたレイアウト調整

### 2.4 データ操作

#### 2.4.1 データ取得
```javascript
// 既存APIエンドポイントを活用
const fetchBookDetail = async (bookId) => {
  const response = await fetch(`/api/v1/books/${bookId}`);
  return response.json();
};
```

#### 2.4.2 データ更新
```javascript
// 既存のPUT エンドポイントを活用
const updateBook = async (bookId, bookData) => {
  const response = await fetch(`/api/v1/books/${bookId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookData)
  });
  return response.json();
};
```

## 3. 技術要件

### 3.1 フロントエンド実装

#### 3.1.1 新規コンポーネント
```
src/components/
├── BookDetail.js          # メインの詳細コンポーネント
├── BookDetailModal.js     # モーダル版（Option A）
├── BookEditForm.js        # 編集フォーム
└── BookInfoTabs.js        # タブ付き情報表示
```

#### 3.1.2 Redux状態管理
```javascript
// actions/booksActions.js に追加
export const fetchBookDetail = (bookId) => async (dispatch) => {
  dispatch({ type: 'FETCH_BOOK_DETAIL_REQUEST' });
  try {
    const book = await api.getBookById(bookId);
    dispatch({ type: 'FETCH_BOOK_DETAIL_SUCCESS', payload: book });
  } catch (error) {
    dispatch({ type: 'FETCH_BOOK_DETAIL_FAILURE', payload: error.message });
  }
};

export const updateBookDetail = (bookId, bookData) => async (dispatch) => {
  dispatch({ type: 'UPDATE_BOOK_REQUEST' });
  try {
    const updatedBook = await api.updateBook(bookId, bookData);
    dispatch({ type: 'UPDATE_BOOK_SUCCESS', payload: updatedBook });
  } catch (error) {
    dispatch({ type: 'UPDATE_BOOK_FAILURE', payload: error.message });
  }
};
```

#### 3.1.3 状態管理構造
```javascript
// reducers/booksReducer.js
const initialState = {
  books: [],
  currentBook: null,
  bookDetail: null,
  loading: false,
  error: null,
  isEditMode: false
};
```

### 3.2 バックエンド拡張

#### 3.2.1 既存API活用
- `GET /api/v1/books/{id}` - 詳細情報取得（実装済み）
- `PUT /api/v1/books/{id}` - 書籍情報更新（実装済み）

#### 3.2.2 関連データ取得API
```java
// BookController.java に追加予定
@GetMapping("/{id}/authors")
public ResponseEntity<List<AuthorDto>> getBookAuthors(@PathVariable Long id) {
    // 書籍の著者一覧を取得
}

@GetMapping("/{id}/categories")
public ResponseEntity<List<CategoryDto>> getBookCategories(@PathVariable Long id) {
    // 書籍のカテゴリ一覧を取得
}

@GetMapping("/{id}/inventory")
public ResponseEntity<InventoryDto> getBookInventory(@PathVariable Long id) {
    // 書籍の在庫情報を取得
}
```

#### 3.2.3 データベース拡張
**関連エンティティ活用**
- `BookAuthor` - 書籍-著者関連（役割付き）
- `BookCategory` - 書籍-カテゴリ関連（プライマリ指定）
- `Inventory` - 在庫情報
- `Publisher` - 出版社情報

## 4. ユーザーストーリー

### 4.1 書店スタッフ（商品管理担当）
```
As a 書店スタッフ
I want to 書籍の詳細情報を素早く確認したい
So that 顧客からの問い合わせに迅速に対応できる

Acceptance Criteria:
- 書籍一覧から詳細ボタンをクリックして詳細情報を表示できる
- 書籍の基本情報、著者、カテゴリ、在庫が一画面で確認できる
- モバイルデバイスでも見やすく表示される
```

### 4.2 店長（商品管理責任者）
```
As a 店長
I want to 書籍情報を編集・更新したい
So that 価格変更や情報修正を即座に反映できる

Acceptance Criteria:
- 詳細画面から編集モードに切り替えできる
- 価格、技術レベル、説明文等を編集できる
- 保存時にバリデーションエラーが適切に表示される
- 変更履歴が記録される（将来的な要件）
```

### 4.3 顧客サポート担当
```
As a 顧客サポート担当
I want to 技術書の詳細情報を顧客に案内したい
So that 適切な推薦と購入支援ができる

Acceptance Criteria:
- 技術レベル、対象読者層が明確に表示される
- サンプルコードや関連リソースのリンクが確認できる
- 在庫状況が正確に把握できる
```

## 5. 実装計画

### 5.1 Phase 1: 基本詳細表示機能
**期間**: 2-3日
**成果物**:
- BookDetailコンポーネント実装
- 詳細ボタンのonClickハンドラー実装
- 基本情報表示（読み取り専用）
- Redux状態管理対応

**実装順序**:
1. BookDetailコンポーネントの基本構造作成
2. 既存API（GET /api/v1/books/{id}）との接続
3. Material-UI コンポーネントでUI構築
4. BookList.jsでの詳細ボタン機能化

### 5.2 Phase 2: 関連情報表示
**期間**: 2-3日
**成果物**:
- 著者、出版社、カテゴリ情報表示
- 在庫情報表示
- タブ構成のUI実装

**実装順序**:
1. 関連データ取得のAPI呼び出し実装
2. AuthorInfo, PublisherInfo, CategoryInfoコンポーネント
3. InventoryInfoコンポーネント
4. タブレイアウトの実装

### 5.3 Phase 3: 編集機能
**期間**: 3-4日
**成果物**:
- 書籍情報編集フォーム
- バリデーション機能
- 更新API連携

**実装順序**:
1. BookEditFormコンポーネント実装
2. フォームバリデーション実装
3. 編集モード切り替え機能
4. 更新API（PUT /api/v1/books/{id}）連携
5. 楽観的更新とエラーハンドリング

### 5.4 Phase 4: UX改善・最適化
**期間**: 1-2日
**成果物**:
- レスポンシブデザイン対応
- ローディング状態の改善
- エラー表示の改善

## 6. テスト要件

### 6.1 単体テスト
```javascript
// BookDetail.test.js
describe('BookDetail Component', () => {
  test('should display book information correctly', () => {
    // 書籍情報が正しく表示されることを確認
  });
  
  test('should enter edit mode when edit button is clicked', () => {
    // 編集ボタンクリックで編集モードになることを確認
  });
  
  test('should validate form input correctly', () => {
    // フォームバリデーションが正しく動作することを確認
  });
});
```

### 6.2 統合テスト
- API連携の動作確認
- Redux状態管理の動作確認
- エラーハンドリングの確認

### 6.3 E2Eテスト
- 書籍一覧→詳細表示→編集→保存の一連フロー
- 異なるデバイスサイズでの表示確認

## 7. パフォーマンス要件

### 7.1 応答時間
- 詳細表示: 1秒以内
- 編集フォーム表示: 0.5秒以内
- データ更新: 2秒以内

### 7.2 同時アクセス
- 10-20名の同時アクセスを想定
- レスポンシブ性を維持

## 8. セキュリティ要件

### 8.1 認証・認可
- 既存のSpring Securityを活用
- 編集権限の確認（店長レベル以上）

### 8.2 データ検証
- XSS対策（入力値サニタイゼーション）
- SQLインジェクション対策（JPA活用）
- CSRFトークン検証

## 9. 監視・運用

### 9.1 ログ記録
- 詳細表示アクセスログ
- 編集操作ログ
- エラー発生ログ

### 9.2 メトリクス
- 詳細表示の利用回数
- 編集操作の頻度
- ページロード時間

## 10. 将来的な拡張

### 10.1 拡張候補機能
- 書籍画像のアップロード・表示
- レビュー・評価機能
- 書籍推薦機能
- 一括編集機能
- 変更履歴表示
- 印刷・PDF出力機能

### 10.2 技術的改善
- 画像最適化
- キャッシュ戦略
- リアルタイム在庫更新

## 11. リスク・制約事項

### 11.1 技術的リスク
- レガシー技術スタック（React 16.13.x）の制約
- Material-UI 4.x の制限
- H2データベースの制約（開発環境）

### 11.2 運用上のリスク
- 在庫データとの整合性
- 同時編集による競合状態
- 大量データでのパフォーマンス低下

### 11.3 制約事項
- ISBN-13は変更不可（マスタキー）
- 既存APIの仕様に準拠
- 既存のDBスキーマ構造を保持

## 12. 完成時の期待効果

### 12.1 業務効率改善
- 書籍情報確認時間: 50%短縮
- 情報更新作業: 70%短縮
- 顧客対応時間: 30%短縮

### 12.2 ユーザー体験向上
- 直感的な操作性
- モバイル対応による利便性向上
- 正確で迅速な情報提供

### 12.3 システム品質向上
- データ整合性の向上
- エラー率の削減
- 運用監視の改善

---

**文書管理**
- 作成日: 2024年12月
- 版数: 1.0
- 承認者: システム責任者
- 次回レビュー: 実装完了後
