const openModalActivities = () => {
  const divActivities=$('#divActivities');
  divActivities.empty();
  firebase.database().ref('actividades').on('child_added', function (snap) {
    name = snap.val().name;
    console.log(name);
    const html = `
    <div class="col-md-6">
    <div class="form-check">
      <label class="form-check-label">
        <input type="radio" class="form-check-input" name="optionsRadios" id="optionsRadios1" value="option1" >
        ${name}
      </label>
    </div> 
    </div>
    `;
    divActivities.append(html);
  });
}
$('#btn_saveRoute').click(openModalActivities);
