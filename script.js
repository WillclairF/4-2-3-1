// Symfony CRUD — alle codes en commands in volgorde


// Kopieer blok voor blok. Vervang Smartphone, Vendor, oefen en eventuele poortnummers als je toets andere namen gebruikt. Deze handleiding gaat uit van Symfony + Doctrine + MySQL/MariaDB.

// 1. Symfony-project en database
// Maak een Symfony Web-project in PhpStorm. Maak database oefen in phpMyAdmin.

// Terminal (in de projectmap)
// composer install
// .env — vervang de actieve DATABASE_URL-regel
// DATABASE_URL="mysql://root:@127.0.0.1:3306/oefen?serverVersion=10.4.32-MariaDB&charset=utf8mb4"
// De versie 10.4.32-MariaDB is een voorbeeld. Gebruik je eigen MariaDB-versie en inloggegevens indien anders.

// Terminal — test verbinding
// php bin/console doctrine:query:sql "SELECT 1"
// 2. Smartphone entity — terminal
// php bin/console make:entity Smartphone
// Voer achtereenvolgens deze velden in (als UX Turbo wordt gevraagd: no):
// Property	Field type	Extra	Nullable
// type	string	length 255	no
// memory	integer	—	no
// color	string	length 255	no
// description	string	length 255	no
// picture	string	length 255	no
// price	decimal	precision 7, scale 2	no


// Druk Enter bij een lege propertynaam om te stoppen.
// 3. Vendor entity — terminal
// php bin/console make:entity Vendor
// Property name → string → 255 → nullable no. Daarna Enter bij lege propertynaam.
// 4. Relatie — terminal
// php bin/console make:entity Smartphone
// Antwoorden in volgorde:
// Vraag	Antwoord
// New property	vendor
// Field type	relation
// Related entity	Vendor
// Relationship	ManyToOne
// Nullable	no
// Add inverse property to Vendor	yes
// Field in Vendor	smartphones
// orphanRemoval	yes (zoals in oefenvideo)


// Daarna Enter bij lege propertynaam.
// 5. Migrations — terminal
// php bin/console make:migration
// php bin/console doctrine:migrations:migrate
// Bevestig met yes als daarom wordt gevraagd.
// 6. Vendor-data — phpMyAdmin → database oefen → SQL
// INSERT INTO vendor (name) VALUES ('Samsung'), ('Apple');
// 7. Controller en formulier genereren — terminal
// php bin/console make:controller SmartphoneController
// php bin/console make:form SmartphoneType Smartphone
// Bij PHPUnit-vraag: no.
// 8. src/Form/SmartphoneType.php — volledige inhoud
// <?php

// namespace App\Form;

// use App\Entity\Smartphone;
// use App\Entity\Vendor;
// use Symfony\Bridge\Doctrine\Form\Type\EntityType;
// use Symfony\Component\Form\AbstractType;
// use Symfony\Component\Form\Extension\Core\Type\SubmitType;
// use Symfony\Component\Form\FormBuilderInterface;
// use Symfony\Component\OptionsResolver\OptionsResolver;

// class SmartphoneType extends AbstractType
// {
//     public function buildForm(FormBuilderInterface $builder, array $options): void
//     {
//         $builder
//             ->add('type')
//             ->add('memory')
//             ->add('color')
//             ->add('description')
//             ->add('picture')
//             ->add('price')
//             ->add('vendor', EntityType::class, [
//                 'class' => Vendor::class,
//                 'choice_label' => 'name',
//             ])
//             ->add('save', SubmitType::class, [
//                 'label' => 'Save',
//             ]);
//     }

//     public function configureOptions(OptionsResolver $resolver): void
//     {
//         $resolver->setDefaults([
//             'data_class' => Smartphone::class,
//         ]);
//     }
// }
// 9. src/Controller/SmartphoneController.php — volledige inhoud (READ / VIEW / CREATE / UPDATE / DELETE)
// <?php

// namespace App\Controller;

// use App\Entity\Smartphone;
// use App\Form\SmartphoneType;
// use App\Repository\SmartphoneRepository;
// use Doctrine\ORM\EntityManagerInterface;
// use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
// use Symfony\Component\HttpFoundation\Request;
// use Symfony\Component\HttpFoundation\Response;
// use Symfony\Component\Routing\Attribute\Route;

// final class SmartphoneController extends AbstractController
// {
//     #[Route('/smartphone', name: 'app_smartphone')]
//     public function index(SmartphoneRepository $smartphoneRepository): Response
//     {
//         $smartphones = $smartphoneRepository->findAll();

//         return $this->render('smartphone/index.html.twig', [
//             'smartphones' => $smartphones,
//         ]);
//     }

//     #[Route('/smartphone/view/{id}', name: 'app_view_smartphone')]
//     public function view(int $id, SmartphoneRepository $smartphoneRepository): Response
//     {
//         $smartphone = $smartphoneRepository->find($id);

//         if (!$smartphone) {
//             throw $this->createNotFoundException('Smartphone niet gevonden');
//         }

//         return $this->render('smartphone/view.html.twig', [
//             'smartphone' => $smartphone,
//         ]);
//     }

//     #[Route('/smartphone-add', name: 'app_smartphone_add')]
//     public function add(Request $request, EntityManagerInterface $entityManager): Response
//     {
//         $smartphone = new Smartphone();
//         $form = $this->createForm(SmartphoneType::class, $smartphone);
//         $form->handleRequest($request);

//         if ($form->isSubmitted() && $form->isValid()) {
//             $entityManager->persist($smartphone);
//             $entityManager->flush();

//             $this->addFlash('success', 'Smartphone toegevoegd!');
//             return $this->redirectToRoute('app_smartphone');
//         }

//         return $this->render('smartphone/add.html.twig', [
//             'form' => $form->createView(),
//         ]);
//     }

//     #[Route('/smartphone/update/{id}', name: 'app_update_smartphone')]
//     public function update(
//         int $id,
//         Request $request,
//         SmartphoneRepository $smartphoneRepository,
//         EntityManagerInterface $entityManager
//     ): Response {
//         $smartphone = $smartphoneRepository->find($id);

//         if (!$smartphone) {
//             throw $this->createNotFoundException('Smartphone niet gevonden');
//         }

//         $form = $this->createForm(SmartphoneType::class, $smartphone);
//         $form->handleRequest($request);

//         if ($form->isSubmitted() && $form->isValid()) {
//             $entityManager->flush();
//             $this->addFlash('success', 'Smartphone aangepast!');
//             return $this->redirectToRoute('app_smartphone');
//         }

//         return $this->render('smartphone/update.html.twig', [
//             'form' => $form->createView(),
//         ]);
//     }

//     #[Route('/smartphone/delete/{id}', name: 'app_delete_smartphone', methods: ['POST'])]
//     public function delete(
//         int $id,
//         Request $request,
//         SmartphoneRepository $smartphoneRepository,
//         EntityManagerInterface $entityManager
//     ): Response {
//         $smartphone = $smartphoneRepository->find($id);

//         if (!$smartphone) {
//             throw $this->createNotFoundException('Smartphone niet gevonden');
//         }

//         if (!$this->isCsrfTokenValid(
//             'delete' . $smartphone->getId(),
//             $request->getPayload()->getString('_token')
//         )) {
//             throw $this->createAccessDeniedException('Ongeldige token');
//         }

//         $entityManager->remove($smartphone);
//         $entityManager->flush();

//         $this->addFlash('danger', 'Smartphone verwijderd!');
//         return $this->redirectToRoute('app_smartphone');
//     }
// }
// 10. templates/smartphone/index.html.twig — volledig overzicht
// {% extends 'base.html.twig' %}

// {% block title %}Smartphones{% endblock %}

// {% block body %}
//     <h1>Smartphones</h1>

//     {% for label, messages in app.flashes %}
//         {% for message in messages %}
//             <p>{{ message }}</p>
//         {% endfor %}
//     {% endfor %}

//     <table border="1">
//         <thead>
//             <tr>
//                 <th>ID</th>
//                 <th>Vendor</th>
//                 <th>Type</th>
//                 <th>Actions</th>
//             </tr>
//         </thead>
//         <tbody>
//             {% for smartphone in smartphones %}
//                 <tr>
//                     <td>{{ smartphone.id }}</td>
//                     <td>{{ smartphone.vendor.name }}</td>
//                     <td>{{ smartphone.type }}</td>
//                     <td>
//                         <a href="{{ path('app_view_smartphone', {id: smartphone.id}) }}">View</a>
//                         <a href="{{ path('app_update_smartphone', {id: smartphone.id}) }}">Update</a>
//                         <form method="post" action="{{ path('app_delete_smartphone', {id: smartphone.id}) }}" style="display:inline">
//                             <input type="hidden" name="_token" value="{{ csrf_token('delete' ~ smartphone.id) }}">
//                             <button type="submit">Delete</button>
//                         </form>
//                     </td>
//                 </tr>
//             {% else %}
//                 <tr><td colspan="4">Nog geen smartphones gevonden.</td></tr>
//             {% endfor %}
//         </tbody>
//     </table>

//     <br>
//     <a href="{{ path('app_smartphone_add') }}">Add Smartphone</a>
// {% endblock %}
// 11. templates/smartphone/view.html.twig — detailpagina (nieuw bestand)
// {% extends 'base.html.twig' %}

// {% block title %}Smartphone bekijken{% endblock %}

// {% block body %}
//     <h1>{{ smartphone.type }}</h1>

//     <table border="1">
//         <tr><th>ID</th><td>{{ smartphone.id }}</td></tr>
//         <tr><th>Vendor</th><td>{{ smartphone.vendor.name }}</td></tr>
//         <tr><th>Type</th><td>{{ smartphone.type }}</td></tr>
//         <tr><th>Memory</th><td>{{ smartphone.memory }}</td></tr>
//         <tr><th>Color</th><td>{{ smartphone.color }}</td></tr>
//         <tr><th>Description</th><td>{{ smartphone.description }}</td></tr>
//         <tr><th>Picture</th><td>{{ smartphone.picture }}</td></tr>
//         <tr><th>Price</th><td>{{ smartphone.price }}</td></tr>
//     </table>

//     <br>
//     <a href="{{ path('app_smartphone') }}">Go Back</a>
// {% endblock %}
// 12. templates/smartphone/add.html.twig — toevoegen (nieuw bestand)
// {% extends 'base.html.twig' %}

// {% block title %}Smartphone toevoegen{% endblock %}

// {% block body %}
//     <h1>Smartphone toevoegen</h1>
//     {{ form(form) }}
//     <br>
//     <a href="{{ path('app_smartphone') }}">Terug naar overzicht</a>
// {% endblock %}
// 13. templates/smartphone/update.html.twig — aanpassen (nieuw bestand)
// {% extends 'base.html.twig' %}

// {% block title %}Smartphone aanpassen{% endblock %}

// {% block body %}
//     <h1>Smartphone aanpassen</h1>
//     {{ form(form) }}
//     <br>
//     <a href="{{ path('app_smartphone') }}">Terug naar overzicht</a>
// {% endblock %}
// 14. Server starten en routes controleren — terminal
// symfony serve
// Open een tweede terminal voor:
// php bin/console debug:router
// Open het adres en de poort die je server zelf toont, met /smartphone erachter (bijvoorbeeld http://127.0.0.1:8002/smartphone).
// 15. Testen — formulier Add Smartphone
// Veld	Waarde
// Type	Galaxy S24
// Memory	256
// Color	Black
// Description	Samsung smartphone
// Picture	galaxy.png
// Price	799.99
// Vendor	Samsung


// Save → View → Update → Delete testen.
// 16. GitHub — terminal (optioneel)
// Maak eerst een lege repository via https://github.com/new. Gebruik bij voorkeur geen automatisch aangemaakt README als je deze bestaande projectmap pusht.
// git init
// git add .
// git commit -m "Symfony CRUD compleet"
// git branch -M main
// git remote add origin https://github.com/JOUW-GEBRUIKERSNAAM/JOUW-REPOSITORY.git
// git push -u origin main
// Vervang de repository-URL. Controleer vóór git add . dat .env.local, wachtwoorden en andere geheime bestande