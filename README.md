Eksperyment z lampkami
=====


Specyfikacja:




Programu można używać w wielu sesjach. Jeśli praca zostanie przerwana, można ją kontynuować od tego samego momentu.

Zadanie jest wykonywane offline, a wyniki są zapisywane lokalnie. Wyniki można wysłać poprzez przesłanie odpowiedniego pliku mailem lub wybranie odpowiedniej opcji w programie. Po włączeniu programu automatycznie kontynuowany jest ten sam eksperyment. Jest też ukryta opcja uruchomienia trybu treningowego, w którym nie zapisujemy danych. Używając tej opcji, możemy przeprowadzić kilkuminutowe wprowadzenie dla osoby która będzie uczestniczyć w eksperymencie. 

Do policzenia będzie jaki rozmiar mają mieć “lampki” na ekranie (trzeba założyć jaka jest odległość od ekranu i policzyć tak żeby mieściły się w 7 st. kącie widzenia)

Sposób działania:
zaczynamy działanie naciśnięciem dowolnego klawisza
wszystkie lampki są na czarno 
czekamy czas ts = (1 + x) sekund, gdzie x jest losowo wybrane ze zbioru {0.5, 0.65, 0.8, 0.95}.
Zapalamy jakiś układ lampek na żółto.
Zaczynamy mierzyć czas w momencie wciśnięcia pierwszego klawisza po wyświetleniu układu lampek.
Od tego momentu jest 0.1 s do skończenia wciskania układu. Jeśli do tego momentu nie zostanie naciśnięty jakiś klawisz z tego układu, wystąpił błąd typu B.
Jeśli jakiś klawisz nie z układu zostanie wciśnięty między wyświetleniem sekwencji a 0.1 s po wciśnięciu wszystkich klawiszy z sekwencji lub wystąpieniem błędu typu B, to wystąpił błąd typu A.
Po definitywnym zakończeniu (czyli maksymalnie 0.2 sekundach) wyświetlamy ewentualne błędy: 
Przez 3 dodatkowe sekundy odpowiednia lampka mruga: na żółto/czarno jeśli nie wciśnięto klawisza a lampka była zapalona (błąd B); na czerwono/czarno jeśli wciśnięto klawisz a nie powinien być wciśnięty (błąd A).
jak dostaniemy odpowiedź, gasimy lampki
powrót to punktu b)
w całym zadaniu 75 razy prezentujemy w losowej kolejności zbiór {1..2^10-1}. W eksperymencie cały zbiór jest planowany od razu: sklejone jedna po drugiej 75 permutacji zbioru {1..2^10-1}.

Powyższe zasady są tylko do działania programu, ale nie do wyliczania wyników. Do wyliczania wyników będziemy stosować logi, z których będziemy wyciągać to co potrzebne. Logować należy:
wszystkie decyzje i akcje programu:
włączenie programu
wyświetlenie układu lampek
rozpoczęcie mierzenia czasu od początku wciskania układu
zakończenie mierzenia czasu po upływie 0.1 s od wciśnięcia całego układu lub upłynięcia limitu czasu
wyświetlenie widoku błędów (jaki)
schowanie widoku błędów
zamknięcie strony
akcje użytkownika
wystartowanie przez naciśnięcie dowolnego klawisza
wciśnięcia poszczególnych przycisków, w dowolnym czasie (nawet jak lampki się nie świecą)
puszczenia poszczególnych przycisków
Każde takie wydarzenie jest zapisywane z dokładnym czasem w milisekundach, typem wydarzenia, przyczyną (jeśli da się coś doprecyzować) i wszystkimi szczegółami np. wyświetlonym układem lampek. Logi muszą pozwalać odtworzyć dokładny przebieg całego działania, wszystko co było wyświetlone na ekranie i co robił użytkownik.
Logi powinny też być łatwe do przetworzenia, tzn. pozwolić nam stosunkowo łatwo (skryptem w Pythonie który wszystko wciągnie i przeanalizuje) wyciągnąć podstawowe dane do analizy, czyli liczbę błędów i czasy od wyświetlenia do udzielenia odpowiedzi

