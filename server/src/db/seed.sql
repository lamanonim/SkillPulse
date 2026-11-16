-- SkillPulse — başlanğıc məzmun
-- Qaydalar: direction kiçik hərflə ('frontend' | 'backend');
-- questions.skill və tasks.skill hərfi-hərfinə eyni; correct_answer = options-dakı variantın TAM mətni.
-- İlk 15 sual və 15 tapşırıq backend-in mock faylından götürülüb (eyni ID-lərlə), sonra əlavə suallar gəlir.

-- ===================== SUALLAR =====================
INSERT INTO questions (direction, skill, question, options, correct_answer) VALUES
-- ----- frontend: HTML -----
('frontend', 'HTML', 'Hansı teq ən böyük başlıq üçündür?', '["<h6>", "<h1>", "<head>", "<title>"]', '<h1>'),
('frontend', 'HTML', 'Linki yeni tabda açmaq üçün hansı atribut istifadə olunur?', '["target=\"_blank\"", "rel=\"new\"", "href=\"_new\"", "open=\"tab\""]', 'target="_blank"'),
('frontend', 'HTML', 'Semantik teq hansıdır?', '["<div>", "<span>", "<article>", "<b>"]', '<article>'),
-- ----- frontend: CSS -----
('frontend', 'CSS', 'Flexbox-da elementləri üfüqi mərkəzləşdirən xassə?', '["align-items", "justify-content", "text-align", "float"]', 'justify-content'),
('frontend', 'CSS', 'Ən yüksək spesifiklik hansıdır?', '[".class", "div", "#id", "*"]', '#id'),
('frontend', 'CSS', 'position: absolute element nəyə görə yerləşir?', '["body-yə", "Ən yaxın positioned valideynə", "Viewport-a", "Əvvəlki qardaş elementə"]', 'Ən yaxın positioned valideynə'),
-- ----- frontend: JavaScript -----
('frontend', 'JavaScript', 'typeof null nə qaytarır?', '["\"null\"", "\"undefined\"", "\"object\"", "\"number\""]', '"object"'),
('frontend', 'JavaScript', 'Hansı açar söz blok scope yaradır?', '["var", "let", "function", "this"]', 'let'),
('frontend', 'JavaScript', '[1,2,3].map(x => x * 2) nəticəsi?', '["[1,2,3]", "[2,4,6]", "6", "undefined"]', '[2,4,6]'),
-- ----- backend: Node.js -----
('backend', 'Node.js', 'Node.js hansı mühərrik üzərində işləyir?', '["SpiderMonkey", "V8", "Chakra", "JVM"]', 'V8'),
('backend', 'Node.js', 'Express-də middleware-i növbətiyə ötürən funksiya?', '["done()", "next()", "pass()", "continue()"]', 'next()'),
('backend', 'Node.js', 'package.json-da asılılıqları quraşdıran əmr?', '["npm start", "npm install", "node install", "npm run"]', 'npm install'),
-- ----- backend: SQL -----
('backend', 'SQL', 'Təkrarlanan sətirləri çıxaran açar söz?', '["UNIQUE", "DISTINCT", "GROUP", "ONLY"]', 'DISTINCT'),
('backend', 'SQL', 'Hər iki cədvəldə uyğun gələn sətirləri qaytaran JOIN?', '["LEFT JOIN", "INNER JOIN", "FULL JOIN", "CROSS JOIN"]', 'INNER JOIN'),
('backend', 'SQL', 'Qruplaşdırılmış nəticəni filtrləyən hissə?', '["WHERE", "HAVING", "ORDER BY", "LIMIT"]', 'HAVING'),

-- ===== Əlavə suallar (daha çətin: düşüncə və kod oxuma) =====
-- HTML
('frontend', 'HTML', 'Ekran oxuyucuları (screen reader) üçün şəklin mənasını hansı atribut verir?', '["title", "alt", "name", "aria-hidden=\"true\""]', 'alt'),
('frontend', 'HTML', '<label> elementini input-a düzgün bağlamaq üçün nə etmək lazımdır?', '["label-ə name atributu vermək", "label-in for atributunu input-un id-si ilə eyni yazmaq", "input-u label-dən sonra yazmaq", "label-ə class vermək"]', 'label-in for atributunu input-un id-si ilə eyni yazmaq'),
-- CSS
('frontend', 'CSS', 'box-sizing: border-box olan, width: 200px, padding: 20px, border: 5px elementin ümumi eni nə qədərdir?', '["200px", "240px", "250px", "225px"]', '200px'),
('frontend', 'CSS', 'Mobil ekranda elementlər yan-yana sığmayıb kənara daşır. Flex konteynerə nə əlavə etmək lazımdır?', '["flex-wrap: wrap", "flex-direction: row", "align-items: stretch", "display: inline"]', 'flex-wrap: wrap'),
-- JavaScript
('frontend', 'JavaScript', 'Bu kod konsola nə çıxarır? console.log(0.1 + 0.2 === 0.3)', '["true", "false", "undefined", "TypeError"]', 'false'),
('frontend', 'JavaScript', 'Bu kod nə çıxarır? for (var i = 0; i < 3; i++) { setTimeout(() => console.log(i), 0) }', '["0 1 2", "3 3 3", "0 0 0", "undefined x3"]', '3 3 3'),
-- Node.js
('backend', 'Node.js', 'Express-də async route-da await ilə atılan xəta mərkəzi error handler-ə necə çatdırılır (Express 4)?', '["Avtomatik çatır", "try/catch ilə tutub next(err) çağırmaqla", "process.exit() ilə", "res.end(err) ilə"]', 'try/catch ilə tutub next(err) çağırmaqla'),
('backend', 'Node.js', 'Şifrəni bazada saxlamağın düzgün yolu hansıdır?', '["Olduğu kimi saxlamaq", "Base64 ilə kodlaşdırmaq", "bcrypt ilə hash etmək", "JWT içində saxlamaq"]', 'bcrypt ilə hash etmək'),
-- SQL
('backend', 'SQL', 'SQL injection-dan qorunmağın əsas yolu hansıdır?', '["Sorğunu string birləşdirmə ilə yazmaq", "Parametrləşdirilmiş sorğulardan ($1, $2) istifadə etmək", "Yalnız SELECT istifadə etmək", "Cədvəl adlarını gizlətmək"]', 'Parametrləşdirilmiş sorğulardan ($1, $2) istifadə etmək'),
('backend', 'SQL', 'users (10 sətir) və orders (yalnız 4 istifadəçinin sifarişi var) cədvəllərində sifarişi olmayanlar da daxil BÜTÜN istifadəçiləri görmək üçün hansı JOIN lazımdır?', '["INNER JOIN orders", "users LEFT JOIN orders", "users RIGHT JOIN orders", "CROSS JOIN orders"]', 'users LEFT JOIN orders');

-- ===================== TAPŞIRIQLAR =====================
-- Hər bacarıq üçün ən azı 3 tapşırıq (Zəif səviyyəyə 3 tapşırıq verilir)
INSERT INTO tasks (skill, title, description) VALUES
('HTML', 'Semantik teqlərlə bloq səhifəsi qur', 'header, nav, main, article, footer istifadə et.'),
('HTML', 'Qeydiyyat formu hazırla', 'input tipləri, label və required atributlarını tətbiq et.'),
('HTML', 'MDN-də HTML forms bölməsini oxu', 'Əsas form elementlərinin siyahısını çıxar.'),
('CSS', 'Flexbox Froggy oyununu bitir', 'Bütün 24 səviyyəni keç.'),
('CSS', 'Responsiv kart grid-i yarat', 'CSS Grid və media query istifadə et.'),
('CSS', 'Position xassələrini praktikada yoxla', 'relative/absolute/fixed/sticky üçün demo hazırla.'),
('JavaScript', 'To-do list tətbiqi yaz', 'DOM manipulyasiyası və localStorage ilə.'),
('JavaScript', 'Array metodları üzrə 10 tapşırıq həll et', 'map, filter, reduce, find istifadə et.'),
('JavaScript', 'Fetch ilə açıq API-dən məlumat göstər', 'async/await və xəta idarəsi ilə.'),
('Node.js', 'Sadə Express REST API yaz', 'CRUD endpoint-ləri ilə.'),
('Node.js', 'Custom logger middleware yaz', 'Hər sorğunun metodu və müddətini log et.'),
('Node.js', 'fs modulu ilə fayl oxu/yaz', 'Promise əsaslı fs/promises istifadə et.'),
('SQL', 'SQLBolt dərslərini bitir', 'İlk 12 dərsi keç.'),
('SQL', 'JOIN növləri üzrə 5 sorğu yaz', 'INNER, LEFT, RIGHT nümunələri.'),
('SQL', 'GROUP BY + HAVING tapşırıqları', 'Aqreqat funksiyalarla hesabat sorğuları yaz.');
